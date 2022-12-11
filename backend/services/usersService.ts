import bcrypt from 'bcryptjs';
import HttpException from '../models/httpException';
import { RegisterUser } from '../models/registerUserModel';
import { UserDatabase } from '../database/index';

class UserService {

  private static checkUserUniqueness = async (email: string): Promise<boolean> => {
    const user = await UserDatabase.getUser(email);
    if (user) {
      return false;
    }
    return true;
  };

  static loginUser = async (input: RegisterUser): Promise<RegisterUser> => {
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

    return user;
  };

  static registerUser = async (user: RegisterUser): Promise<string> => {

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

    const unique = await UserService.checkUserUniqueness(email);

    if (!unique) {
      throw new HttpException(422, { errors: { email: ["is already taken"] } });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const success = await UserDatabase.createUser(name, email, hashedPassword)

    if (!success) {
      throw new HttpException(500, { errors: { user: ["fail to create"] } });
    }

    return name;
  };
}

export default UserService;