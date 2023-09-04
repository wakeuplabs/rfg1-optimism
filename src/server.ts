import http from "http";
import express, { Express } from "express";
import morgan from "morgan";
import routes from "./routes";
import middlewares from "./middlewares";
import cors from "cors";
import "dotenv/config";

const app: Express = express();

app.use(cors());

/** Logging */
app.use(morgan("dev"));
/** Parse the request */
app.use(express.urlencoded({ extended: false }));
/** Takes care of JSON data */
app.use(express.json());
/** Takes care of file upload */

/** Routes */
app.use("/", routes);

/** Error handling */
app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

/** Server */
const httpServer = http.createServer(app);
const PORT: any = process.env.PORT ?? 6060;

httpServer.listen(PORT, () =>
  console.log(`The server is running on port ${PORT}`)
);

module.exports = httpServer;
