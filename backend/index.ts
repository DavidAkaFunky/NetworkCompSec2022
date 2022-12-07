import express, { Express, Request, Response } from "express";
import path from "path";
import morgan from "morgan";

const { databaseSchema } = require('./database');
const { usersRoute } = require("./routes");
const app: Express = express();
const port = process.env.PORT || 3001;

app.use(morgan("tiny"));
// create db tables if needed
databaseSchema.initializeSchema();

app.use("/api/users", usersRoute);

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