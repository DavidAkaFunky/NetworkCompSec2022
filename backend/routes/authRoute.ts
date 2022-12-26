import { Router, Request, Response, NextFunction } from "express";
import LoginData from "../models/loginData";
import UserRegisterData from "../models/userRegisterData";
import AdminRegisterData from "../models/adminRegisterData";
import AdminValidationData from "../models/adminValidationData";
import { AuthService, TwoFAService } from "../services/index";

const router = Router();

router.post("/totp/generate", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const content = await TwoFAService.generateTOTPQRCode(req.body.email);
        res.status(200).json({
            secret: content.secret,
            qrCode: content.qrCode
        });
    } catch (err: any) {
        next(err);
    }
});

router.post("/register-client", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        await AuthService.registerUser(req.body as UserRegisterData);
        res.sendStatus(200);
    } catch (err: any) {
        next(err);
    }
});

router.post("/register-admin", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const result = await AuthService.registerAdmin(req.body as AdminRegisterData);
        res.status(200).json(result);
    } catch (err: any) {
        next(err);
    }
});

router.post("/validate-admin", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        await AuthService.validateAdmin(req.body as AdminValidationData);
        res.sendStatus(200);
    } catch (err: any) {
        next(err);
    }
});

router.post("/first-fase-login", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const status = await AuthService.firstFaseLogin(req.body as LoginData);
        if(status) {
            res.sendStatus(302);
        } else {
            res.sendStatus(200);
        }
    } catch (err: any) {
        next(err);
    }
});

router.post("/second-fase-login", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const loginData = {
            email: req.body.email,
            password: req.body.password,
        }

        const userLogged = await AuthService.secondFaseLogin(loginData as LoginData, req.body.token);

        res.setHeader("Cache-Control", "no-cache=set-cookie");
        res.cookie("refreshToken", userLogged.refreshToken, {
            httpOnly: true,   // can't be accessed by javascript
            secure: false,    // can only be sent over https
            expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // expires in 1 day
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
        // Refresh token expired
        if (err.status === 401) {
            res.cookie("refreshToken", "", {
                httpOnly: true,
                expires: new Date(0),
            });
            res.status(err.errorCode).json(err.message);
        } else {
            next(err);
        }
    }
});

router.get("/change-password", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const accessToken = await AuthService.refreshToken(req.cookies);
        res.status(200).json({ accessToken });
    } catch (err: any) {
        next(err);
    }
});

router.get("/logout", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        await AuthService.logoutUser(req.body.refreshToken);
        res.cookie("refreshToken", "", {
            httpOnly: true,
            expires: new Date(0),
        });
        res.sendStatus(200);
    } catch (err: any) {

        // Refresh token expired
        if (err.status === 401) {
            res.cookie("refreshToken", "", {
                httpOnly: true,
                expires: new Date(0),
            });
            res.status(err.errorCode).json(err.message);
        } else {
            next(err);
        }
    }
});

export const authRoutes: Router = router;