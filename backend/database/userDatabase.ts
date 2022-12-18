import { User } from "@prisma/client";
import prisma from "../prisma/client"

class UserDatabase {

  public static createUser = async (name: string, email: string, admin: boolean, pwd: string, twoFASecret: string): Promise<boolean> => {
    try {
      await prisma.user.create({
        data: {
          name: name,
          email: email,
          admin: admin,
          password: pwd,
          twoFASecret: twoFASecret,
        }
      });
      return true;

    } catch (err) {
      return false;
    }
  }

  public static getUser = async (email: string): Promise<User | null> => {
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

  public static getAllUsers = async (): Promise<User[]> => {
    try {
      const users = await prisma.user.findMany();
      return users;
    } catch (err) {
      return [];
    }
  }
}


export default UserDatabase;
