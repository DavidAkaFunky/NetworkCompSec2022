import { Router, Request, Response, NextFunction } from "express";
import { TokenService, UserService } from "../services";
//import axios from "axios";

const router = Router();

router.get("/clients", TokenService.checkAdminPermission, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const users = await UserService.getAllUsers();
        //const res = await axios.post('http:/bank/clients', { users });
        //res.sendStatus(res.status);
        res.sendStatus(403);
    } catch (err: any) {
        next(err);
    }
});

export const portugalBankRoutes: Router = router;