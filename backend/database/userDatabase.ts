import { User } from "@prisma/client";
import prisma from "../prisma/client"

class UserDatabase {

  public static createUser = async (name: string, email: string, admin: boolean, pwd: string, twoFASecret?: string): Promise<boolean> => {
    try {
      await prisma.user.create({
        data: {
          name: name,
          email: email,
          admin: admin,
          password: pwd,
          twoFASecret: twoFASecret || undefined,
        }
      });
      return true;

    } catch (err) {
      return false;
    }
  }

  public static addUserTwoFASecret = async (email: string, twoFASecret: string): Promise<boolean> => {
    try {
      await prisma.user.update({
        where: {
          email: email
        },
        data: {
          twoFASecret: twoFASecret
        }
      });
      return true;

    } catch (err) {
      return false;
    }
  }

  public static getUser = async (email: string): Promise<User | null> => {
    try {
      const user = await prisma.user.findUnique({
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

  public static changeUserPassword = async(email: string, password: string): Promise<boolean> => {
    try {
      await prisma.user.update({
        where: {
          email: email
        },
        data: {
          password: password
        }
      });
      return true;

    } catch (err) {
      return false;
    }
  }
}


export default UserDatabase;
