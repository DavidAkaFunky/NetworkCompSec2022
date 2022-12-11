import { NextFunction } from "express";
import jwt from "jsonwebtoken";
import HttpException from "../models/httpException";

class AuthService {
    private static accessSecret: string = process.env.JWT_ACCESS_TOKEN as string;
    private static refreshSecret: string = process.env.JWT_REFRESH_TOKEN as string;

    public static generateAccessToken = (email: string): string => {
        return jwt.sign({email: email}, this.accessSecret, { expiresIn: '10m' });
    }

    public static generateRefreshToken = (email: string): string => {
        return jwt.sign({email: email}, this.refreshSecret, { expiresIn: '1d' });
    }

    public static verifyRefreshToken = (token: string): string => {
        return jwt.verify(token, this.accessSecret) as string;
    }

    // Authentication middleware
    // its any because overload wouldn't match in router.post(/userProducts)
    // maybe there is a fix
    public static authenticateToken = (req: any, res: any, next: any) => {

        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            throw new HttpException(401, { message: { token: ["missing token"] } });
        }

        jwt.verify(token, this.accessSecret, (err: any, id: any) => {
            if (err) {
                throw new HttpException(403, { message: { token: ["invalid token"] } });   
            }
            req.body.id = id;
            next();
        })
    }
}

export default AuthService;