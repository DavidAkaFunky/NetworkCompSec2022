import express from "express";
import morgan from "morgan";
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import HttpException from "./models/httpException";
import routes from "./routes/index";

const app = express();

app.use(morgan("tiny"));
app.use(bodyParser.json());
app.use(cookieParser())

app.use("/api", routes);

// Error handling middleware
app.use((err: any, req: any, res: any, next: any) => {
    if (err instanceof HttpException) {
        res.status(err.errorCode).json(err.message);
    } else if (err instanceof Error) {
        res.status(500).json({ errors: { global: "Something went wrong" } });
    }
});

// Start the server
const host = process.env.HOST || "localhost";
const port = process.env.PORT || "3001";
app.listen(parseInt(port), host, () => {
    console.log("⚡️[server]: Server is running at http://" + host + ":" + port);
});