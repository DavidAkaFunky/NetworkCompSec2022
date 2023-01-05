"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const insuranceRoute_1 = require("./insuranceRoute");
const bankRoute_1 = require("./bankRoute");
const router = (0, express_1.Router)();
router.use('/insurance', insuranceRoute_1.insuranceRoutes);
router.use('/bank', bankRoute_1.bankRoutes);
exports.default = router;
