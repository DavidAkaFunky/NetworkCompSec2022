import { Router, Request, Response, NextFunction } from "express";
import LoginData from "../models/loginData";
import UserRegisterData from "../models/userRegisterData";
import AdminRegisterData from "../models/adminRegisterData";
import { AuthService, TwoFAService, TokenService } from "../services/index";
import { UserRoles } from "../models/userRoles";

const router = Router();

router.post("/totp/generate",  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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

router.post("/register-admin", TokenService.checkSuperAdminPermission, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const result = await AuthService.registerAdmin(req.body as AdminRegisterData);
        res.status(200).json(result);
    } catch (err: any) {
        next(err);
    }
});

router.post("/first-stage-login", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const content = await AuthService.firstStageLogin(req.body as LoginData);
        res.status(200).json(content);
    } catch (err: any) {
        next(err);
    }
});

router.post("/second-stage-login", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const loginData = {
            email: req.body.email,
            password: req.body.password,
        }

        const userLogged = await AuthService.secondStageLogin(loginData as LoginData, req.body.token, req.body.secret);

        res.setHeader("Cache-Control", "no-cache=set-cookie");
        res.cookie("refreshToken", userLogged.refreshToken, {
            httpOnly: true,   // can't be accessed by javascript
            secure: false,    // can only be sent over https
            expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // expires in 1 day
        });
        res.status(200).json({
            name: userLogged.name,
            email: userLogged.email,
            role: userLogged.role,
            accessToken: userLogged.accessToken,
        });

    } catch (err: any) {
        next(err);
    }
});

router.get("/refresh", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const refreshData = await AuthService.refreshToken(req.cookies);
        res.status(200).json(refreshData);
    } catch (err: any) {
        // Refresh token expired
        if (err.status === 401) {
            res.cookie("refreshToken", "", {
                httpOnly: true,
                expires: new Date(0),
            });
            res.status(err.errorCode).send(err.message);
        } else {
            next(err);
        }
    }
});

router.patch("/change-password", TokenService.checkAuthPermission, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        await AuthService.changeUserPassword(req.body.email, req.body.oldPassword, req.body.newPassword);
        res.sendStatus(200);
    } catch (err: any) {
        next(err);
    }
});

router.get("/logout", TokenService.checkAuthPermission, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        await AuthService.logoutUser(req.cookies);
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
            res.status(err.errorCode).send(err.message);
        } else {
            next(err);
        }
    }
});

export const authRoutes: Router = router;