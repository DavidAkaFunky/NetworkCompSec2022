import { User } from '../models/userModel';
import { RegisterUser } from '../models/registerUserModel';

const { userDatabase } = require('../database');

/* export const registerUser = async (username: string, pwd: string): Promise<void> => {
    userDatabase.addUser(username, pwd);
}; */

export const registerUser = async (input: RegisterUser): Promise<User> => {
    const email = input.email?.trim();
    const username = input.username?.trim();
    const password = input.password?.trim();
  
    if (!email) {
      //throw new HttpException(422, { errors: { email: ["can't be blank"] } });
    }
  
    if (!username) {
      //throw new HttpException(422, { errors: { username: ["can't be blank"] } });
    }
  
    if (!password) {
      //throw new HttpException(422, { errors: { password: ["can't be blank"] } });
    }
  
    //await checkUserUniqueness(email, username);
  
    //const hashedPassword = await bcrypt.hash(password, 10);
  
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: /*hashedPassword*/"dummy",
      },
      select: {
        email: true,
        username: true,
      },
    });
  
    return {
      ...user,
      token: generateToken(user),
    };
};