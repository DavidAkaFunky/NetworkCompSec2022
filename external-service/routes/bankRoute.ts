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

        clientsInfo.push(req.body as ClientInfo);
        res.sendStatus(200);
    } catch (err: any) {
        next(err);
    }
});

router.get("/clientsInfo/:email", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {

        for (let clientInfo of clientsInfo) {
            if (clientInfo.email == req.params.email) {
                res.status(200).json({ clientInfo });
                return;
            }
        }

        res.status(404).json({ message: "Client not found" });
    } catch (err: any) {
        next(err);
    }
});

export const bankRoutes: Router = router;