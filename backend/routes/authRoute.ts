import { Router, Request, Response, NextFunction } from "express";
import RegisterUser from "../models/registerUser";
import { AuthService } from "../services/index";

const router = Router();

router.post("/register", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user = await AuthService.registerUser(req.body as RegisterUser);
        res.status(200).json({ user });
    } catch (err: any) {
        next(err)
    }
});

router.post("/login", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user = await AuthService.loginUser(req.body);

        res.cookie("refreshToken", user.refreshToken, {
            httpOnly: true,  // can't be accessed by javascript
            secure: false,    // can only be sent over https
        });
        res.status(200).json({ 
            user: user.email, 
            accessToken: user.accessToken,
        });
    } catch (err: any) {
        next(err) 
    }
});

router.post("/refresh", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const accessToken = await AuthService.refreshToken(req.cookies);
        res.status(200).json({ accessToken });
    } catch (err: any) {
        next(err)
    }
});

router.post("/logout", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        await AuthService.logoutUser(req.body);
        res.status(200);
    } catch (err: any) {
        next(err) 
    }
});

export const usersRoutes: Router = router;