import { Router, Request, Response, NextFunction } from "express";
import ClientInfo from "../models/ClientInfo";

const router = Router();

const clientsInfo: ClientInfo[] = []

// The system has integration with external institutions, namely, the Bank of Portugal (to communicate the financial details of the customers) 

router.post("/clientInfo", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const clientInfo: ClientInfo = {
            "name": "Client 1",
            "address": "Address 1",
            "phone": "32545261269",
            "email": ""
        };

        //req.body.clientInfo = clientInfo;

        clientsInfo.push(clientInfo);
        res.status(200).json({ clientInfo });
    } catch (err: any) {
        next(err);
    }
});

router.get("/clientsInfo", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        res.status(200).json({ clientsInfo });
    } catch (err: any) {
        next(err);
    }
});

export const bankRoutes: Router = router;