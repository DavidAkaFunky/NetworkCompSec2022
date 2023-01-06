import { Router, Request, Response, NextFunction } from "express";
import { TokenService } from "../services";
import axios from "axios";

const router = Router();

router.get("/all", TokenService.checkUserPermission, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const serviceRes = await axios.get("http://" + process.env.EXTERNAL_HOST + "/insurance/loans-info");
        res.status(serviceRes.status).json(serviceRes.data);
    } catch (err: any) {
        next(err);
    }
});

export const loanRoutes: Router = router;