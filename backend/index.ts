import express from "express";
import morgan from "morgan";
import cors from "cors";
import bodyParser from 'body-parser';
import HttpException from "./models/httpException";
import routes from "./routes/index";

const app = express();

app.use(cors())
app.use(morgan("tiny"));
app.use(bodyParser.json());

app.use("/api", routes);

app.use((err: any, req: any, res: any, next: any) => {

    if (err instanceof HttpException) {
        res.status(err.errorCode).json(err.message);
    } else if (err instanceof Error) {
        res.status(500).json({ errors: { global: "Something went wrong" } });
    }
});


// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("⚡️[server]: Server is running at http://localhost:" + port);
});