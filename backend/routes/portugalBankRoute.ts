import { Router, Request, Response, NextFunction } from "express";
import { TokenService, UserService } from "../services";
import axios from "axios";
import { StockTransaction, User } from "@prisma/client";

const router = Router();

router.get("/clients", TokenService.checkAdminPermission, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const fullUsers = await UserService.getAllUsersAndTransactions();
        const users = fullUsers.map((user: User & { transactions: StockTransaction[] }) => {
            return {
                name: user.name,
                email: user.email,
                transactions: user.transactions.map((transaction: StockTransaction) => {
                    return {
                        stock: transaction.stockId,
                        createdAt: transaction.createdAt,
                        price: transaction.price,
                        type: transaction.type
                    }
                })
            }
        });
        const serviceRes = await axios.post("http:/" + process.env.EXTERNAL_HOST + ":" + process.env.EXTERNAL_PORT + "/bank/clients", { users });
        res.sendStatus(serviceRes.status);
    } catch (err: any) {
        next(err);
    }
});

export const portugalBankRoutes: Router = router;