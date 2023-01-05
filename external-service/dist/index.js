"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const index_1 = __importDefault(require("./routes/index"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use("/", index_1.default);
// Start the server
const host = process.env.HOST || "localhost";
const port = process.env.PORT || "3002";
app.listen(parseInt(port), host, () => {
    console.log("⚡️[server]: Server is running at http://" + host + ":" + port);
});
