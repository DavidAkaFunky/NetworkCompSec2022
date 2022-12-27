import bcrypt from 'bcryptjs';
import HttpException from '../models/httpException';
import UserRegisterData from '../models/userRegisterData';
import AdminRegisterData from '../models/adminRegisterData';
import LoginData from '../models/loginData';
import UserLoggedData from '../models/userLoggedData';
import { AdminDatabase, UserDatabase, RefreshTokenDatabase } from '../database/index';
import { TokenService, TwoFAService } from './index';
import { User, Admin } from '@prisma/client';
import TwoFAData from '../models/twoFAData';

class AuthService {

  private static checkUserUniqueness = async (email: string): Promise<boolean> => {
    return !(await UserDatabase.getUser(email));
  };

  private static checkAdminUniqueness = async (email: string): Promise<boolean> => {
    return !(await AdminDatabase.getAdmin(email));
  };

  //========================================================================================
  //-------------------------------------REGISTER CLIENT------------------------------------
  //========================================================================================

  public static registerUser = async (user: UserRegisterData): Promise<void> => {

    const name = user.name?.trim();
    const email = user.email?.trim();
    const password = user.password?.trim();
    const secret = user.secret?.trim();
    const token = user.token?.trim();

    //adicionar regex
    if (!email) {
      throw new HttpException(422, { errors: { email: ["can't be blank"] } });
    }

    if (!name) {
      throw new HttpException(422, { errors: { username: ["can't be blank"] } });
    }

    if (!password || password.length < 4) {
      throw new HttpException(422, { errors: { password: ["can't be blank"] } });
    }

    if (!secret || !token) {
      throw new HttpException(422, { errors: { secret: ["does not exist"] } });
    }

    const adminEmailRegex = /^([a-zA-Z0-9\.]){4,30}(@ncmb.pt)$/g;
    const emailRegex = /^([a-zA-Z0-9\.]){4,30}@([a-zA-Z\.]){4,10}$/g;

    if (adminEmailRegex.test(email) || !emailRegex.test(email)){
      throw new HttpException(422, { errors: { email: ["is invalid"] } });
    }

    const unique = await this.checkUserUniqueness(email);

    if (!unique) {
      throw new HttpException(422, { errors: { email: ["is already taken. Please remove your 2FA code from the app"] } });
    }

    const match = await TwoFAService.verifyTOTPQRCode(token, secret);

    if (!match) {
      throw new HttpException(401, { message: { secret: ["Wrong 2FA token"] } });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const success = await UserDatabase.createUser(name, email, hashedPassword, secret);

    if (!success) {
      throw new HttpException(500, { errors: { user: ["could not be created"] } });
    }
  };

  //========================================================================================
  //-------------------------------------REGISTER ADMIN-------------------------------------
  //========================================================================================

  public static registerAdmin = async (registerData: AdminRegisterData): Promise<LoginData> => {

    const name = registerData.name?.trim();
    const partialEmail = registerData.partialEmail?.trim();

    if (!partialEmail) {
      throw new HttpException(422, { errors: { email: ["can't be blank"] } });
    }

    if (!name) {
      throw new HttpException(422, { errors: { username: ["can't be blank"] } });
    }

    const emailRegex = /^([a-zA-Z0-9\.]){4,30}$/g;

    if (!emailRegex.test(partialEmail)){
      throw new HttpException(422, { errors: { email: ["is invalid"] } });
    }

    const email = partialEmail + "@ncmb.pt";

    const unique = await this.checkAdminUniqueness(email);

    if (!unique) {
      throw new HttpException(422, { errors: { email: ["is already taken."] } });
    }

    const password = require('crypto').randomBytes(16).toString('hex');

    const hashedPassword = await bcrypt.hash(password, 10);

    const success = await AdminDatabase.createAdmin(name, email, hashedPassword, null);

    if (!success) {
      throw new HttpException(500, { errors: { admin: ["could not be created"] } });
    }

    const result = {
      email: email,
      password: password,
    }

    return result as LoginData;
  }

  //========================================================================================
  //-------------------------------------LOGIN----------------------------------------------
  //========================================================================================

  private static loginVerification =async (loginData: LoginData): Promise<User|Admin> => {
    const email = loginData.email?.trim();
    const password = loginData.password?.trim();

    if (!email) {
      throw new HttpException(422, { message: { email: ["can't be blank"] } });
    }

    if (!password) {
      throw new HttpException(422, { message: { password: ["can't be blank"] } });
    }

    let user: User | Admin | null;

    const emailRegex = /^([a-zA-Z0-9\.]){4,30}(@ncmb.pt)$/g;

    //Check if is admin or client
    if (emailRegex.test(email)){
      user = await AdminDatabase.getAdmin(email);
    } else {
      user = await UserDatabase.getUser(email);
    }

    if (!user) {
      throw new HttpException(401, { message: { username: ["No user exists with this e-mail"] } });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      throw new HttpException(401, { message: { username: ["Wrong password"] } });
    }

    return user;
  }

  private static adminNeedValidation = (admin: Admin): boolean => {

    if(admin.twoFASecret != null) {
      return false;
    }

    return true;
  }

  public static firstStageLogin = async (loginData: LoginData): Promise<TwoFAData | null> => {
    const user = await this.loginVerification(loginData);

    const emailRegex = /^([a-zA-Z0-9\.]){4,30}(@ncmb.pt)$/g;

    //Check if is admin or client
    if (emailRegex.test(user.email) && this.adminNeedValidation(user as Admin))
      return await TwoFAService.generateTOTPQRCode(user.email);
    
    return null;
  };

  public static secondStageLogin = async (loginData: LoginData, token: string, secret?: string): Promise<UserLoggedData> => {

    const user = await this.loginVerification(loginData);

    const emailRegex = /^([a-zA-Z0-9\.]){4,30}(@ncmb.pt)$/g;

    const isAdmin: boolean = emailRegex.test(user.email);

    let match: boolean

    if (isAdmin && this.adminNeedValidation(user as Admin)) {
      if (!secret){
        throw new HttpException(401, "2FA Secret missing");
      }

      match = await TwoFAService.verifyTOTPQRCode(token, secret);

      if (match && !await AdminDatabase.addAdminTwoFASecret(user.email, secret)){
        throw new HttpException(401, "Failed to add 2FA secret");
      }
    }
    else {
      match = await TwoFAService.verifyTOTPQRCode(token, user.twoFASecret!);
    }

    if (!match) {
      throw new HttpException(401, { message: { username: ["Wrong 2FA token"] } });
    }

    //---------TODO: change tokens for admins

    const accessToken = TokenService.generateAccessToken(user.id);

    const refreshToken = TokenService.generateRefreshToken(user.id);

    const success: boolean = await RefreshTokenDatabase.createRefreshToken(refreshToken);

    if (!success) {
      throw new HttpException(500, { message: { token: ["fail to store refresh token"] } });
    }

    const userTokens = {
      name: user.name,
      email: user.email,
      isAdmin: isAdmin,
      accessToken,
      refreshToken
    }

    return userTokens;
  };

  public static refreshToken = async (cookies: any): Promise<string> => {

    if (!cookies || !cookies.refreshToken) {
      throw new HttpException(401, { message: { token: ["No refresh token provided"] } });
    }

    const refreshToken = cookies.refreshToken;

    try {

      TokenService.verifyRefreshToken(refreshToken);

      return TokenService.generateAccessToken(refreshToken);

    } catch (err) {

      const success = await RefreshTokenDatabase.deleteRefreshToken(refreshToken);

      if (!success) {
        // TODO: if the token doesnt exist, it shouldnt throw an error
        //throw new HttpException(500, { message: { token: ["fail to delete refresh token"] } });
      }

      throw new HttpException(401, { message: { token: ["Refresh token expired"] } })
    }
  };

  public static changeUserPassword = async (email: string, oldPassword: string, newPassword: string): Promise<void> => {

    const success = await UserDatabase.changeUserPassword(email, oldPassword, newPassword);

    if (!success) {
      throw new HttpException(500, { message: { password: ["Failed to change"] } });
    }
  };

  public static logoutUser = async (refreshToken: string): Promise<void> => {

    const success = await RefreshTokenDatabase.deleteRefreshToken(refreshToken);

    if (!success) {
      // TODO: if the token doesnt exist, it shouldnt throw an error
      //throw new HttpException(500, { message: { token: ["fail to delete refresh token"] } });
    }
  };
}

export default AuthService;