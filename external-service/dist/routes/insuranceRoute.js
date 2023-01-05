"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.insuranceRoutes = void 0;
const express_1 = require("express");
const router = (0, express_1.Router)();
const loansInfo = [
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
];
// insurance companies (to promote insurance services that are associated with the loans).
router.get("/loans-info", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.status(200).json(loansInfo);
    }
    catch (err) {
        next(err);
    }
}));
exports.insuranceRoutes = router;
