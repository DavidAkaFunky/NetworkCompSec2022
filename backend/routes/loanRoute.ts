import { Router, Request, Response, NextFunction } from "express";
import { StockService } from "../services";

const router = Router();

router.get("/all", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const stocks = await StockService.getAllStocks();
        res.status(200).json({ stocks });

    } catch (err: any) {
        next(err);
    }
});