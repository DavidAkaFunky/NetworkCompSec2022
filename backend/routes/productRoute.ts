import { Router, Request, Response, NextFunction } from "express";
import { ProductService, AuthService } from "../services/index";

const router = Router();

router.get("/userProducts", AuthService.authenticateToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        await ProductService.getUserProducts(req.body.id)
        res.status(200);
    } catch (err: any) {
        next(err) 
    }
});

export const productRoutes: Router = router;