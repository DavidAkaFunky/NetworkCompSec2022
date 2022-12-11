import { Router, Request, Response, NextFunction } from "express";
import RegisterUser from "../models/registerUser";
import { UserService } from "../services/index";

const router = Router();

router.post("/register", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user = await UserService.registerUser(req.body as RegisterUser);
        res.status(200).json({ user });
    } catch (err: any) {
        next(err)
    }
});

router.post("/login", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user = await UserService.loginUser(req.body);
        res.status(200).json({ 
            user: user.email, 
            accessToken: user.accessToken,
            refreshToken: user.refreshToken
        });
    } catch (err: any) {
        next(err) 
    }
});

router.post("/logout", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        await UserService.logoutUser(req.body);
        res.status(200);
    } catch (err: any) {
        next(err) 
    }
});

export const usersRoutes: Router = router;