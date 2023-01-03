import { Router, Request, Response, NextFunction } from "express";

const router = Router();

router.post("/newClient", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const data = await fetch("https://", req.body);
        res.status(data.status);
    } catch (err: any) {
        next(err);
    }
});

export const portugalBankRoutes: Router = router;