import { RegisterUser } from '../models/registerUserModel';
import { UserDatabase } from '../database/index';

class UserService {
  static registerUser = async (input: RegisterUser): Promise<boolean> => {
    const name = input.username?.trim();
    const email = input.email?.trim();
    const password = input.password?.trim();

    if (!email) {
      //throw new HttpException(422, { errors: { email: ["can't be blank"] } });
    }

    if (!name) {
      //throw new HttpException(422, { errors: { username: ["can't be blank"] } });
    }

    if (!password) {
      //throw new HttpException(422, { errors: { password: ["can't be blank"] } });
    }

    //await checkUserUniqueness(email, username);

    //const hashedPassword = await bcrypt.hash(password, 10);

    return UserDatabase.createUser(name, email, /* hashed */password)

    /* return {
      ...user,
      token: generateToken(user),
    }; */
  };
}

export default UserService;