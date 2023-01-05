import { Router, Request, Response, NextFunction } from "express";
//import axios from "axios";

const router = Router();

router.post("/newClient", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        //const res = await axios.post('http://external/clientInfo', req.body);
        //res.sendStatus(res.status);
        res.sendStatus(403);
    } catch (err: any) {
        next(err);
    }
});

export const portugalBankRoutes: Router = router;