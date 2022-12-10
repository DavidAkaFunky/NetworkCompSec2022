import { RegisterUser } from '../models/registerUserModel';
import { UserDatabase } from '../database/index';
import bcrypt from 'bcryptjs';

class UserService {
    static registerUser = async (name: string, email: string, password: string): Promise<boolean> => {
        return true;
    };
    
    static loginUser = async (input: RegisterUser): Promise<RegisterUser> => {
        const email = input.email?.trim();
        const password = input.password?.trim();

        if (!email) {
            throw new Error();
            //throw new HttpException(422, { message: { email: ["can't be blank"] } });
        }

        if (!password) {
            throw new Error();
            //throw new HttpException(422, { message: { password: ["can't be blank"] } });
        }

        const user: RegisterUser | null = await UserDatabase.getUser(email);

        if (!user){
            throw new Error();
            //throw new HttpException(401, { message: { username: ["No user exists with this e-mail"] } });
        }

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            throw new Error();
            //throw new HttpException(401, { message: { username: ["Wrong password"] } });
        }
        return user;
    };
}

export default UserService;