import express, { Express, Request, Response } from "express";
//import path from "path";
import morgan from "morgan";
import bodyParser from 'body-parser';
import { mainRoute } from "./routes";

const app: Express = express();
const port = process.env.PORT;

app.use(morgan("tiny"));
app.use(bodyParser.json());


app.use("/api", mainRoute);

app.listen(port, () => {
    console.log("⚡️[server]: Server is running at http://localhost:" + port);
});