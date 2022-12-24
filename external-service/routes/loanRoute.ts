import { Router, Request, Response, NextFunction } from "express";

const router = Router();

// insurance companies (to promote insurance services that are associated with the loans).

router.get("/loansInfo", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const loansInfo = {
            "loans": [
                {
                    "loanAmount": 1000,
                    "loanDuration": 12,
                    "interestRate": 0.1,
                    "bank": {
                        "name": "Bank 1",
                        "address": "Address 1",
                        "phone": "32545261269",
                        "email": ""
                    }
                },
                {
                    "loanAmount": 2000,
                    "loanDuration": 24,
                    "interestRate": 0.2,
                    "bank": {
                        "name": "Bank 2",
                        "address": "Address 2",
                        "phone": "67555261261",
                        "email": ""
                    }
                }
            ]
        };
        res.status(200).json({ loansInfo });
    } catch (err: any) {
        next(err);
    }
});

export const loanRoutes: Router = router;