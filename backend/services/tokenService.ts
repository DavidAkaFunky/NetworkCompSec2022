import jwt from "jsonwebtoken";
import { RefreshTokenDatabase } from "../database";
import HttpException from "../models/httpException";

class TokenService {
    private static accessSecret: string = process.env.JWT_ACCESS_TOKEN as string;
    private static refreshSecret: string = process.env.JWT_REFRESH_TOKEN as string;

    public static generateAccessToken = (email: string): string => {
        return jwt.sign({ email: email }, this.accessSecret, { expiresIn: '10m' });
    }

    public static generateRefreshToken = (email: string): string => {
        return jwt.sign({ email: email }, this.refreshSecret, { expiresIn: '2h' });
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

    // Should only be called after the authenticateAccessToken middleware
    public static getUserEmailFromRequest = (req: any) => {
        const token = req.headers['authorization'].split(' ')[1];
        return jwt.decode(token);
    }

    // Authentication middleware
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
}

export default TokenService;