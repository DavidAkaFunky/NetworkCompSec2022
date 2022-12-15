import { Router, Request, Response, NextFunction } from "express";
import RegisterUser from "../models/registerUser";
import { AuthService } from "../services/index";

const router = Router();

router.post("/totp/generate", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const content = await AuthService.generateTOTPQRCode(req.body.email);
        res.status(200).json({
            secret: content.secret,
            qrCode: content.qrCode
        });
    } catch (err: any) {
        next(err);
    }
});

router.post("/totp/verify-register", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const result = await AuthService.verifyTOTPQRCode(req.body.token, req.body.secret);
        res.status(200).json({ result });
    } catch (err: any) {
        next(err);
    }
});

router.post("/register", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user = await AuthService.registerUser(req.body as RegisterUser);
        res.status(200).json({ user });
    } catch (err: any) {
        next(err);
    }
});


router.post("/verify-login", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user = await AuthService.verifyUserLogin(req.body);
        res.status(200).json({ user });
    } catch (err: any) {
        next(err);
    }
});

router.post("/login", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userTokens = await AuthService.loginUser(req.body.email, req.body.token);

        res.cookie("refreshToken", userTokens.refreshToken, {
            httpOnly: true,  // can't be accessed by javascript
            secure: false,    // can only be sent over https
        });
        res.status(200).json({ 
            isAdmin: userTokens.isAdmin,
            accessToken: userTokens.accessToken,
        });
    } catch (err: any) {
        next(err);
    }
});

router.get("/refresh", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const accessToken = await AuthService.refreshToken(req.cookies);
        res.status(200).json({ accessToken });
    } catch (err: any) {
        next(err)
    }
});

router.get("/logout", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        await AuthService.logoutUser(req.body);
        res.status(200);
    } catch (err: any) {
        next(err);
    }
});

export const usersRoutes: Router = router;