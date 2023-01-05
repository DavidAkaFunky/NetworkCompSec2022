import { Router, Request, Response, NextFunction } from "express";
//import axios from "axios";

const router = Router();

router.get("/all", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        //const res = await axios.get('https://external/loansInfo');
        //res.status(res.status).json(res.data);
    } catch (err: any) {
        next(err);
    }
});

router.get("/acquire/:id", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        //const res = await axios.get('https://external/loan/acquire/' + req.params.id);
        //res.status(res.status).json(res.data);
    } catch (err: any) {
        next(err);
    }
});

export const loanRoutes: Router = router;