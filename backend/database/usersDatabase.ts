import { User } from "@prisma/client";
import prisma from "../prisma/client"

class UserDatabase {

  static createUser = async (name: string, email: string, pwd: string): Promise<boolean> => {
    try {
      await prisma.user.create({
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

  static getUser = async (email: string): Promise<User | null> => {
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
