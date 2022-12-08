import prisma from "../prisma/prisma-client"

export const createUser = (username: string, email: string, pwd: string)  => {
  try{
    prisma.user.create({
      data: {
        username: username,
        email: email,
        password: pwd,
      }
    });
    return true;
  } catch (err) {
    return false;
  }
}
