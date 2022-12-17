import { Router, Request, Response, NextFunction } from "express";
import UserRegisterData from "../models/userRegisterData";
import { AuthService, twoFAService } from "../services/index";
import UserLoginData from "../models/userLoginData";

const router = Router();

router.post("/totp/generate", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const content = await twoFAService.generateTOTPQRCode(req.body.email);
        res.status(200).json({
            secret: content.secret,
            qrCode: content.qrCode
        });
    } catch (err: any) {
        next(err);
    }
});

router.post("/register", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        await AuthService.registerUser(req.body as UserRegisterData);
        res.status(200);
    } catch (err: any) {
        next(err);
    }
});


router.post("/verify-login", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        await AuthService.verifyUserLogin(req.body as UserLoginData);
        res.status(200);
    } catch (err: any) {
        next(err);
    }
});

router.post("/login", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const loginData = 
        {
            email: req.body.email,
            password: req.body.password,
        }
        const userLogged = await AuthService.loginUser(loginData as UserLoginData, req.body.token);

        res.cookie("refreshToken", userLogged.refreshToken, {
            httpOnly: true,  // can't be accessed by javascript
            secure: false,    // can only be sent over https
        });
        res.status(200).json({ 
            name: userLogged.name,
            email: userLogged.email,
            isAdmin: userLogged.isAdmin,
            accessToken: userLogged.accessToken,
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
        await AuthService.logoutUser(req.body.accessToken, req.body.refreshToken);
        res.status(200);
    } catch (err: any) {
        next(err);
    }
});

export const usersRoutes: Router = router;