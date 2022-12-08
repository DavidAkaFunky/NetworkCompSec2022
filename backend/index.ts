import express, { Express, Request, Response } from "express";
import path from "path";
import morgan from "morgan";
import bodyParser from 'body-parser';

const { databaseSchema } = require('./database');
const { mainRoute } = require("./routes");

const app: Express = express();
const port = process.env.PORT || 3001;

app.use(morgan("tiny"));
app.use(bodyParser.json());

// create db tables if needed
databaseSchema.initializeSchema();

app.use("/api", mainRoute);

//app.use(express.static(path.join(__dirname, '../../frontend/build')));

/*
app.get('/*', function(req: Request, res: Response) {
  res.sendFile(path.join(__dirname, '../../frontend/build/index.html'), function(err: Error) {
    if (err) {
      res.status(500).send(err)
    }
  })
})
*/

app.listen(port, () => {
    console.log("⚡️[server]: Server is running at http://localhost:" + port);
});