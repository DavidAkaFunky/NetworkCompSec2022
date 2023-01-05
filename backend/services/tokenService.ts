import jwt from "jsonwebtoken";
import { RefreshTokenDatabase } from "../database";
import HttpException from "../models/httpException";
import { UserRoles } from "../models/userRoles";

class TokenService {
    private static accessSecret: string = process.env.JWT_ACCESS_TOKEN as string;
    private static refreshSecret: string = process.env.JWT_REFRESH_TOKEN as string;

    public static generateAccessToken = (email: string, role: string): string => {
        return jwt.sign({ email: email, role: role }, this.accessSecret, { expiresIn: '10m' });
    }

    public static generateRefreshToken = (email: string): string => {
        return jwt.sign({ email: email }, this.refreshSecret, { expiresIn: '1h' });
    }

    public static verifyRefreshToken = async (refreshToken: string): Promise<string> => {

        const email = await RefreshTokenDatabase.getRefreshToken(refreshToken);
        if (!email) {
            throw new HttpException(403, "Invalid refresh token.");
        }

        jwt.verify(refreshToken, this.refreshSecret, (err: any) => {
            if (err) {
                throw new HttpException(403, "Invalid refresh token.");
            }
        })

        return email;
    }

    // Authentication middleware

    // Verify if access token exists and is valid
    public static authenticateAccessToken = (req: any, res: any, next: any) => {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            throw new HttpException(400, "The access token does not exist.");
        }

        jwt.verify(token, this.accessSecret, (err: any, decoded: any) => {
            if (err) {
                throw new HttpException(403, "Invalid refresh token");
            }
            req.body.email = decoded.email;
            next();
        })
    }

    public static authenticateAccessTokenWithRoles = (roles: any) => {
        return (req: any, res: any, next: any) => {
            const authHeader = req.headers['authorization'];
            const token = authHeader && authHeader.split(' ')[1];

            if (!token) {
                throw new HttpException(400, "The access token does not exist.");
            }

            jwt.verify(token, this.accessSecret, (err: any, decoded: any) => {
                if (err) {
                    throw new HttpException(403, "Invalid refresh token");
                }
                if (!roles.includes(decoded.role)) {
                    throw new HttpException(403, "You do not have permission to access this resource.");
                }

                req.body.email = decoded.email;
                next();
            })

        }
    };

    public static checkSuperAdminPermission = TokenService.authenticateAccessTokenWithRoles([UserRoles.SUPERADMIN]);
    public static checkAdminPermission = TokenService.authenticateAccessTokenWithRoles([UserRoles.SUPERADMIN, UserRoles.ADMIN]);
    public static checkUserPermission = TokenService.authenticateAccessTokenWithRoles([UserRoles.USER]);
    public static checkAuthPermission = TokenService.authenticateAccessTokenWithRoles([UserRoles.SUPERADMIN, UserRoles.ADMIN, UserRoles.USER]);
}

export default TokenService;