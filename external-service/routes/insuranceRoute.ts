import { Router, Request, Response, NextFunction } from "express";
import LoanInfo from "../models/LoanInfo";

const router = Router();

const loansInfo: LoanInfo[] = [
    {
        "loanAmount": 1000,
        "loanDuration": 12,
        "interestRate": 0.1,
        "description": ["Loan 1"],
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
        "description": ["Loan 2"],
        "bank": {
            "name": "Bank 2",
            "address": "Address 2",
            "phone": "67555261261",
            "email": ""
        }
    },
    {
        "loanAmount": 15000,
        "loanDuration": 36,
        "interestRate": 0.05,
        "description": ["Loan 3"],
        "bank": {
            "name": "Bank 3",
            "address": "Address 3",
            "phone": "32545261269",
            "email": ""
        }
    }
]

// insurance companies (to promote insurance services that are associated with the loans).

router.get("/loansInfo", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        res.status(200).json({ loansInfo });
    } catch (err: any) {
        next(err);
    }
});

export const insuranceRoutes: Router = router;