import bcrypt from 'bcryptjs';
import HttpException from '../models/httpException';
import RegisterUser from '../models/registerUser';
import UserTokens from '../models/userTokens';
import { UserDatabase } from '../database/index';
import { TokenService } from './index';

class AuthService {

  private static checkUserUniqueness = async (email: string): Promise<boolean> => {
    const user = await UserDatabase.getUser(email);
    if (user) {
      return false;
    }
    return true;
  };

  public static registerUser = async (user: RegisterUser): Promise<string> => {

    const name = user.name?.trim();
    const email = user.email?.trim();
    const password = user.password?.trim();

    if (!email) {
      throw new HttpException(422, { errors: { email: ["can't be blank"] } });
    }

    if (!name) {
      throw new HttpException(422, { errors: { username: ["can't be blank"] } });
    }

    if (!password) {
      throw new HttpException(422, { errors: { password: ["can't be blank"] } });
    }

    const unique = await AuthService.checkUserUniqueness(email);

    if (!unique) {
      throw new HttpException(422, { errors: { email: ["is already taken"] } });
    }

    // check https://www.npmjs.com/package/bcrypt
    // for correct use of bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    const success = await UserDatabase.createUser(name, email, hashedPassword)

    if (!success) {
      throw new HttpException(500, { errors: { user: ["fail to create"] } });
    }

    return name;
  };

  public static loginUser = async (input: RegisterUser): Promise<UserTokens> => {
    const email = input.email?.trim();
    const password = input.password?.trim();

    if (!email) {
      throw new HttpException(422, { message: { email: ["can't be blank"] } });
    }

    if (!password) {
      throw new HttpException(422, { message: { password: ["can't be blank"] } });
    }

    const user: RegisterUser | null = await UserDatabase.getUser(email);

    if (!user) {
      throw new HttpException(401, { message: { username: ["No user exists with this e-mail"] } });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      throw new HttpException(401, { message: { username: ["Wrong password"] } });
    }

    const accessToken = TokenService.generateAccessToken(email);
    const refreshToken = TokenService.generateRefreshToken(email);
    // store the refresh token

    return { email, accessToken, refreshToken };
  };

  public static refreshToken = async (cookies: any): Promise<string> => {

    if(!cookies || !cookies.refreshToken){
      throw new HttpException(401, { message: { token: ["No refresh token provided"] } });
    }

    const refreshToken = cookies.refreshToken;

    try {
      TokenService.verifyRefreshToken(refreshToken);
      return TokenService.generateAccessToken(refreshToken);
    } catch (err) {
      // apagar refresh token da db
      // user tem de dar login denovo
      throw new HttpException(401, { message: { token: ["Refresh token expired"] }})
    }
  };

  public static logoutUser = async (input: UserTokens): Promise<void> => {
    // delete the refresh token
  };
}

export default AuthService;