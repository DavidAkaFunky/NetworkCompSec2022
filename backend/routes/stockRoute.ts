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

router.get("/:isin", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const stock = await StockService.getStockByISIN(req.params.isin);
        res.status(200).json({ stock });
    } catch (err: any) {
        next(err);
    }
});

router.post("/create", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const stock = await StockService.createStock(req.body);
        res.status(200).json({ stock });
    } catch (err: any) {
        next(err);
    }
});

export const stockRoutes: Router = router;