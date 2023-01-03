import { UserDatabase } from '../database/index';
import { User } from '@prisma/client';
import HttpException from '../models/httpException';

class UserService {

	public static getAllUsers = async (): Promise<User[]> => {
        return UserDatabase.getAllUsers();
    }

    public static getUser = async (email: string): Promise<User> => {
        const user = await UserDatabase.getUser(email);

        if (!user) {
			throw new HttpException(401, "Login failed; invalid email or password.");
		}

        return user;
    }
}

export default UserService;