import prisma from "../prisma/client"

class RefreshTokenDatabase {
    public static createRefreshToken = async (refreshToken: string): Promise<boolean> => {
        try {
            await prisma.refreshToken.create({
                data: {
                    id: refreshToken,
                }
            });
            return true;

        } catch (err) {
            return false;
        }
    }

    public static deleteRefreshToken = async (refreshToken: string): Promise<boolean> => {
        try {
            await prisma.refreshToken.delete({
                where: {
                    id: refreshToken
                }
            });
            return true;

        } catch (err) {
            return false;
        }
    }
}

export default RefreshTokenDatabase;