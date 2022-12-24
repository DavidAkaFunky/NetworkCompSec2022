"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const loanRoute_1 = require("./loanRoute");
const bankRoute_1 = require("./bankRoute");
const router = (0, express_1.Router)();
router.use('/loan', loanRoute_1.loanRoutes);
router.use('/bank', bankRoute_1.bankRoutes);
exports.default = router;
