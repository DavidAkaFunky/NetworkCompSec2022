import { Router, Request, Response, NextFunction } from "express";
import { RegisterUser } from "../models/registerUserModel";
import { UserService } from "../services/index";
import { generateToken } from "../token";

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
        res.status(200).json({ user: user, token: generateToken(user) });
        
    } catch (err: any) {
        next(err) 
    }
});

export const usersRoutes: Router = router;