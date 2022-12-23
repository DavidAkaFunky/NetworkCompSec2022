import bcrypt from 'bcryptjs';
import HttpException from '../models/httpException';
import UserRegisterData from '../models/userRegisterData';
import UserLoginData from '../models/userLoginData';
import UserLoggedData from '../models/userLoggedData';
import { UserDatabase, RefreshTokenDatabase } from '../database/index';
import { TokenService, TwoFAService } from './index';
import { User } from '@prisma/client';

class AuthService {

  private static checkUserUniqueness = async (email: string): Promise<boolean> => {
    return !(await UserDatabase.getUser(email));
  };

  public static registerUser = async (user: UserRegisterData, admin: boolean): Promise<void> => {

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

    const unique = await this.checkUserUniqueness(email);

    if (!unique) {
      throw new HttpException(422, { errors: { email: ["is already taken. Please remove your 2FA code from the app"] } });
    }

    if (!secret || !token) {
      throw new HttpException(422, { errors: { secret: ["does not exist"] } });
    }

    const match = await TwoFAService.verifyTOTPQRCode(token, secret);

    if (!match) {
      throw new HttpException(401, { message: { username: ["Wrong 2FA token"] } });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const success = await UserDatabase.createUser(name, email, admin, hashedPassword, secret);

    if (!success) {
      throw new HttpException(500, { errors: { user: ["could not be created"] } });
    }
  };

  public static verifyUserLogin = async (loginData: UserLoginData): Promise<User> => {
    const email = loginData.email?.trim();
    const password = loginData.password?.trim();

    if (!email) {
      throw new HttpException(422, { message: { email: ["can't be blank"] } });
    }

    if (!password) {
      throw new HttpException(422, { message: { password: ["can't be blank"] } });
    }

    const user: User | null = await UserDatabase.getUser(email);

    if (!user) {
      throw new HttpException(401, { message: { username: ["No user exists with this e-mail"] } });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      throw new HttpException(401, { message: { username: ["Wrong password"] } });
    }

    return user;
  };

  public static loginUser = async (loginData: UserLoginData, token: string): Promise<UserLoggedData> => {
    //const email = loginData.email.trim();
    //const password = loginData.password.trim();
    //const user: User | null = await UserDatabase.getUser(email);
    //if (!user) {
    //  throw new HttpException(401, { message: { username: ["No user exists with this e-mail"] } });
    //}
    //const match = await bcrypt.compare(password, user.password);
    //if (!match) {
    //  throw new HttpException(401, { message: { username: ["Wrong password"] } });
    //}

    const user = await this.verifyUserLogin(loginData);

    const match = await TwoFAService.verifyTOTPQRCode(token, user.twoFASecret!);

    if (!match) {
      throw new HttpException(401, { message: { username: ["Wrong 2FA token"] } });
    }

    const accessToken = TokenService.generateAccessToken(user.id);

    const refreshToken = TokenService.generateRefreshToken(user.id);

    const success: boolean = await RefreshTokenDatabase.createRefreshToken(refreshToken);

    if (!success) {
      throw new HttpException(500, { message: { token: ["fail to store refresh token"] } });
    }

    const userTokens = {
      name: user.name,
      email: user.email,
      isAdmin: user.admin,
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

  public static logoutUser = async (refreshToken: string): Promise<void> => {

    const success = await RefreshTokenDatabase.deleteRefreshToken(refreshToken);

    if (!success) {
      // TODO: if the token doesnt exist, it shouldnt throw an error
      //throw new HttpException(500, { message: { token: ["fail to delete refresh token"] } });
    }
  };
}

export default AuthService;