import bcrypt from 'bcryptjs';
import HttpException from '../models/httpException';
import RegisterUser from '../models/registerUser';
import UserTokens from '../models/userTokens';
import UserSecret from '../models/userSecret';
import authenticator from '../otp_authenticator/authenticator';
import qrcode from 'qrcode';
import { UserDatabase } from '../database/index';
import { TokenService } from './index';
import { User } from '@prisma/client';

class AuthService {

  private static checkUserUniqueness = async (email: string): Promise<boolean> => {
    return !(await UserDatabase.getUser(email));
  };

  public static verifyTOTPQRCode = async (token: string, secret: string): Promise<boolean> => {
    return authenticator.verify({ token, secret });
  };

  public static generateTOTPQRCode = async (email: string): Promise<UserSecret> => {

    const secret = authenticator.generateSecret();
    const otpAuth = authenticator.keyuri(email, "NCMB - Nova Caixa Milenar Bancária", secret);
    const qrCode = await qrcode.toDataURL(otpAuth);

    return { secret, qrCode };
  };

  public static registerUser = async (user: RegisterUser): Promise<string> => {

    const name = user.name?.trim();
    const email = user.email?.trim();
    const password = user.password?.trim();
    const secret = user.secret?.trim();

    console.log("HERE1")
    // TODO COMO REGISTAR ADMINS?
    const admin = false;

    if (!email) {
      throw new HttpException(422, { errors: { email: ["can't be blank"] } });
    }

    if (!name) {
      throw new HttpException(422, { errors: { username: ["can't be blank"] } });
    }

    if (!password) {
      throw new HttpException(422, { errors: { password: ["can't be blank"] } });
    }
    console.log("HERE2")

    const unique = await this.checkUserUniqueness(email);

    if (!unique) {
      throw new HttpException(422, { errors: { email: ["is already taken. Please remove your 2FA code from the app"] } });
    }

    // check https://www.npmjs.com/package/bcrypt
    // for correct use of bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log(name, email, admin, password, hashedPassword, secret);
    const success = await UserDatabase.createUser(name, email, admin, hashedPassword, secret);

    if (!success) {
      throw new HttpException(500, { errors: { user: ["could not be created"] } });
    }

    return name;
  };

  public static verifyUserLogin = async (input: RegisterUser): Promise<void> => {
    const email = input.email?.trim();
    const password = input.password?.trim();

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
    //const match = true; // FOR TESTING PURPOSES

    if (!match) {
      throw new HttpException(401, { message: { username: ["Wrong password"] } });
    }
  };

  public static loginUser = async (email: string, token: string): Promise<UserTokens> => {

    const user: User | null = await UserDatabase.getUser(email);

    if (!user) {
      throw new HttpException(401, { message: { username: ["No user exists with this e-mail"] } });
    }
    
    if (!this.verifyTOTPQRCode(token, user.twoFASecret)) {
      throw new HttpException(401, { message: { username: ["Wrong 2FA token"] } });
    }

    const accessToken = TokenService.generateAccessToken(user.id);
    console.log("HERE2");
    const refreshToken = TokenService.generateRefreshToken(user.id);
    console.log("HERE3");
    const success: boolean = await UserDatabase.createRefreshToken(refreshToken);

    if (!success) {
      throw new HttpException(500, { message: { token: ["fail to store refresh token"] } });
    }
    const userTokens = {
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
      const success = await UserDatabase.deleteRefreshToken(refreshToken);
      if (!success) {
        throw new HttpException(500, { message: { token: ["fail to delete refresh token"] } });
      }
      throw new HttpException(401, { message: { token: ["Refresh token expired"] } })
    }
  };

  public static logoutUser = async (userTokens: UserTokens): Promise<void> => {
    const success = await UserDatabase.deleteRefreshToken(userTokens.refreshToken);
    if (!success) {
      throw new HttpException(500, { message: { token: ["fail to delete refresh token"] } });
    }
  };
}

export default AuthService;