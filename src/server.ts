import http from "http";
import express, { Express } from "express";
import morgan from "morgan";
import routes from "./routes";
import middlewares from "./middlewares";
import cors from "cors";
import "dotenv/config";

const router: Express = express();

router.use(cors());

/** Logging */
router.use(morgan("dev"));
/** Parse the request */
router.use(express.urlencoded({ extended: false }));
/** Takes care of JSON data */
router.use(express.json());
/** Takes care of file upload */

/** Routes */
router.use("/", routes);

/** Error handling */
router.use(middlewares.notFound);
router.use(middlewares.errorHandler);

/** Server */
const httpServer = http.createServer(router);
const PORT: any = process.env.PORT ?? 6060;

httpServer.listen(PORT, () =>
  console.log(`The server is running on port ${PORT}`)
);
