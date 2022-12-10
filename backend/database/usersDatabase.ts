import { RegisterUser } from "../models/registerUserModel";
import prisma from "../prisma/prisma-client"

class UserDatabase {

    static createUser = (name: string, email: string, pwd: string): boolean => {
        try {
            prisma.user.create({
                data: {
                    name: name,
                    email: email,
                    password: pwd,
                }
            });
            return true;
        } catch (err) {
            return false;
        }
    }

    static getUser = async (email: string): Promise<RegisterUser | null> => {
        try {
            const user = await prisma.user.findUniqueOrThrow({
                where: {
                    email: email
                }
            });
            return user;
        } catch (err) {
            return null;
        }
    }
}

export default UserDatabase;
