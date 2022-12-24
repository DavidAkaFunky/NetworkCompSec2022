import express from "express";
import bodyParser from 'body-parser';
import routes from "./routes/index";

const app = express();
app.use(bodyParser.json());

app.use("/", routes);

// Start the server
const host = process.env.HOST || "localhost";
const port = process.env.PORT || "3001";
app.listen(parseInt(port), host, () => {
    console.log("⚡️[server]: Server is running at http://" + host + ":" + port);
});