import prisma from "../prisma/client"

class RefreshTokenDatabase {
    public static createRefreshToken = async (refreshToken: string, email: string): Promise<boolean> => {
        try {
            await prisma.refreshToken.upsert({
                create: {
                    token: refreshToken,
                    email: email
                },
                update: {
                    token: refreshToken,
                
                },
                where: {
                    email: email
                }
            });
            return true;

        } catch (err) {
            return false;
        }
    }

    public static deleteRefreshToken = async (refreshToken: string): Promise<boolean> => {

        try {
            const token = await prisma.refreshToken.findUnique({
                where: {
                    token: refreshToken
                }
            });

            if (!token) {
                return true;
            }

            await prisma.refreshToken.delete({
                where: {
                    email: token.email
                }
            });

            return true;

        } catch (err) {
            return false;
        }
    }

    public static getRefreshToken = async (refreshToken: string): Promise<string | null> => {
        try {
            const token = await prisma.refreshToken.findUnique({
                where: {
                    token: refreshToken
                }
            });

            if (!token) {
                return null;
            }

            return token.email;

        } catch (err) {
            return null;
        }
    }
}

export default RefreshTokenDatabase;