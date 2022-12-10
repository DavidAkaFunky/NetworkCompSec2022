import { Router, Request, Response } from "express";
import { UserService } from "../services/index";
import { generateToken } from "../token";

const router = Router();

router.post("/register", async (req: Request, res: Response): Promise<void> => {
    
});

router.post("/login", async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await UserService.loginUser(req.body);
        res.status(200).json({ user: user, token: generateToken(user) });
    } catch (err: any) { // Change any to HttpException once created
        res.status(err.code).json({ message: err.message });
    }
});

export const usersRoutes: Router = router;