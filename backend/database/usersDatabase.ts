import prisma from "../prisma/prisma-client"

export const addUser = async (username: string, email: string, pwd: string): Promise<void> => {
    await prisma.user.create({
      data: {
        username,
        email,
        pwd: /*hashedPassword*/pwd,
      }
    })
    .then(/* CLIENTE COM USERNAME X CRIADO */)
    .catch(async () => {
        /* DEU ERRO */
    });
}

module.exports = {
    addUser
};