import { Router, Request, Response, NextFunction } from "express";
import { TokenService, UserService } from "../services/index";

const router = Router();

router.get("/get-all", TokenService.checkAdminPermission, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const users = await UserService.getAllUsers();
        res.status(200).json(users);
    } catch (err: any) {
        next(err);
    }
});

router.get("/get-user", TokenService.checkAdminPermission, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user = await UserService.getUser(req.body.email);
        res.status(200).send(user);
    } catch (err: any) {
        next(err);
    }
});

export const userRoutes: Router = router;