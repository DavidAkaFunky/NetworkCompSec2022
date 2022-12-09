import { Router, Request, Response } from "express";
import { UserService } from "../services/index";

const router = Router();

router.post("/register", (req: Request, res: Response): void => {
    const user = UserService.registerUser(req.body.user);
    res.json({ user });
});

router.post("/login", (req: Request, res: Response): void => {
    // TODO
});

export const usersRoutes: Router = router;