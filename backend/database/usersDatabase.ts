import prisma from "../prisma/prisma-client"

class UserDatabase {

  static createUser = (name: string, email: string, pwd: string) => {
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
}

export default UserDatabase;
