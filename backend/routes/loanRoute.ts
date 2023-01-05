import { Router, Request, Response, NextFunction } from "express";
import { TokenService } from "../services";
//import axios from "axios";

const router = Router();

router.get("/all", TokenService.checkUserPermission, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        //const res = await axios.get('https://external/loansInfo');
        //res.status(res.status).json(res.data);
    } catch (err: any) {
        next(err);
    }
});

router.get("/acquire/:id", TokenService.checkUserPermission, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        //const res = await axios.get('https://external/loan/acquire/' + req.params.id);
        //res.status(res.status).json(res.data);
    } catch (err: any) {
        next(err);
    }
});

export const loanRoutes: Router = router;