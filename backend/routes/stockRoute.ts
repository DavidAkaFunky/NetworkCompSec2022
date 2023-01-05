import { Router, Request, Response, NextFunction } from "express";
import { StockService, TokenService } from "../services";

const router = Router();

router.get("/all", TokenService.checkAuthPermission, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const stocks = await StockService.getAllStocks();
        res.status(200).json(stocks);

    } catch (err: any) {
        next(err);
    }
});

router.get("/transactions/user", TokenService.checkUserPermission, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {  
        const transactions = await StockService.getUserTransactions(req.body.email);
        res.status(200).json(transactions);
    } catch (err: any) {
        next(err);
    }
});

router.post("/transactions/admin", TokenService.checkAdminPermission, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {  
        const transactions = await StockService.getUserTransactions(req.body.userEmail);
        res.status(200).json(transactions);
    } catch (err: any) {
        next(err);
    }
});

router.post("/create", TokenService.checkAdminPermission, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const stock = await StockService.createStock(req.body);
        res.status(200).json(stock);
    } catch (err: any) {
        next(err);
    }
});

router.post("/buy/user", TokenService.checkUserPermission, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {  
        await StockService.buyStock(req.body.email, req.body.ISIN);
        res.sendStatus(200);
    } catch (err: any) {
        next(err);
    }
});

router.post("/buy/admin", TokenService.checkAdminPermission, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {  
        await StockService.buyStock(req.body.userEmail, req.body.ISIN);
        res.sendStatus(200);
    } catch (err: any) {
        next(err);
    }
});

router.post("/sell/user", TokenService.checkUserPermission, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {  
        await StockService.sellStock(req.body.email, req.body.ISIN);
        res.sendStatus(200);
    } catch (err: any) {
        next(err);
    }
});


router.post("/sell/admin", TokenService.checkAdminPermission, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {  
        await StockService.sellStock(req.body.userEmail, req.body.ISIN);
        res.sendStatus(200);
    } catch (err: any) {
        next(err);
    }
});

export const stockRoutes: Router = router;