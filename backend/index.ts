import express from "express";
import morgan from "morgan";
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import jwt, { JwtPayload } from "jsonwebtoken";
import HttpException from "./models/httpException";
import routes from "./routes/index";
import path from "path";
import fs from "fs";


const app = express();

// Write logs to file not working yet
//let logStream = fs.createWriteStream(path.join(__dirname,"file.log"), {
//    flags: "a"
//})
//// Logging middleware
//app.use(morgan(function (tokens, req, res) {
//
//    let byWho = "no-access-token";
//    const accessToken = req.headers.authorization?.split(" ")[1];
//    if (accessToken){
//        const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_TOKEN as string) as JwtPayload;
//        byWho = `access-token (user_id: ${decoded.id})`;
//    }
//
//    return [
//        tokens.method(req, res),
//        tokens.url(req, res),
//        tokens.status(req, res),
//        tokens["response-time"](req, res), "ms",
//        byWho
//    ].join(' ')
//}, { stream: logStream }));

// Parsers middleware
app.use(morgan("tiny"));
app.use(bodyParser.json());
app.use(cookieParser())

app.use("/api", routes);

// Error handling middleware
app.use((err: any, req: any, res: any, next: any) => {
    console.error(err);
    if (err instanceof HttpException) {
        res.status(err.errorCode).json(err.message);
    } else if (err instanceof Error) {
        res.status(500).json("Something went wrong.");
    }
});

// Start the server
const host = process.env.HOST || "localhost";
const port = process.env.PORT || "3001";
app.listen(parseInt(port), host, () => {
    console.log("⚡️[server]: Server is running at http://" + host + ":" + port);
});