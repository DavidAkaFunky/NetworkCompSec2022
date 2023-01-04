import { Router, Request, Response, NextFunction } from "express";
import { StockService } from "../services";

const router = Router();

router.get("/all", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const stocks = await StockService.getAllStocks();
        res.status(200).json(stocks);

    } catch (err: any) {
        next(err);
    }
})

router.get("/transactions", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {  
        const transactions = await StockService.getUserTransactions(req.body.email);
        res.status(200).json(transactions);
    } catch (err: any) {
        next(err);
    }
});

/*router.get("/:isin", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const stock = await StockService.getStockByISIN(req.params.ISIN);
        res.status(200).json(stock);
    } catch (err: any) {
        next(err);
    }
}); */

router.post("/create", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const stock = await StockService.createStock(req.body);
        res.status(200).json(stock);
    } catch (err: any) {
        next(err);
    }
});

router.post("/buy", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {  
        await StockService.buyStock(req.body.email, req.body.ISIN);
        res.sendStatus(200);
    } catch (err: any) {
        next(err);
    }
});

router.post("/sell", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {  
        await StockService.sellStock(req.body.email, req.body.ISIN);
        res.sendStatus(200);
    } catch (err: any) {
        next(err);
    }
});

export const stockRoutes: Router = router;