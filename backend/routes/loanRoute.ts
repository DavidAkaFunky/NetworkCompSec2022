import { Router, Request, Response, NextFunction } from "express";

const router = Router();

router.get("/all", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const data = await fetch("https://");
        res.status(200).json(data);
    } catch (err: any) {
        next(err);
    }
});

export const loanRoutes: Router = router;