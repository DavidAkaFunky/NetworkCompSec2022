import express, { Express, Request, Response } from "express";
import path from "path";
import morgan from "morgan";
import { routes } from "./routes";

const app: Express = express();
const port = 3001;

app.use(morgan("tiny"));

app.use("/api/", routes);

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
  console.log("⚡️[server]: Server is running at http://localhost:"+port);
});