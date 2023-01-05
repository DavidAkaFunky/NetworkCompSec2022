import { Router, Request, Response, NextFunction } from "express";
import ClientInfo from "../models/ClientInfo";

const router = Router();

let clientsInfo: ClientInfo[] = [];

// The system has integration with external institutions, namely, the Bank of Portugal (to communicate the financial details of the customers) 

router.post("/clients", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        clientsInfo = req.body.users as ClientInfo[];
        console.log(clientsInfo); // Just to show that the data is being received
        res.sendStatus(200);
    } catch (err: any) {
        next(err);
    }
});

export const bankRoutes: Router = router;