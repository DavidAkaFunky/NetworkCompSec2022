import jwt from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";

const secret: string = process.env.JWT_SECRET || "dfngkngjfnk";

const generateToken = (user: any): string =>
    jwt.sign(user, secret, { expiresIn: '5m' });

const verifyAndRefreshToken = (token: string): string => {
    // What happens if the verification fails?
    const decodedToken: string | JwtPayload = jwt.verify(token, secret);
    return generateToken(decodedToken);
}

export {
    generateToken,
    verifyAndRefreshToken
}