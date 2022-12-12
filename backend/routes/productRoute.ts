import { Router, Request, Response, NextFunction } from "express";
import { ProductService, TokenService } from "../services/index";

const router = Router();

router.get("/userProducts", TokenService.authenticateAccessToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const products = await ProductService.getUserProducts(req.body.id);
        console.log(products);
        res.status(200).json({products});
    } catch (err: any) {
        next(err) 
    }
});

export const productRoutes: Router = router;