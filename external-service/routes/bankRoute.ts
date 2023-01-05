import { Router, Request, Response, NextFunction } from "express";
import ClientInfo from "../models/ClientInfo";

const router = Router();

const clientsInfo: ClientInfo[] = []

// The system has integration with external institutions, namely, the Bank of Portugal (to communicate the financial details of the customers) 

router.post("/clients", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {

        const clients = req.body as ClientInfo[];

        for (let client of clients) {
            clientsInfo.push(client);
        }

        res.sendStatus(200);
    } catch (err: any) {
        next(err);
    }
});

router.get("/client/:email", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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