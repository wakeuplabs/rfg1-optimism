/* eslint-disable @typescript-eslint/no-var-requires */
import express from "express";
import infoController from "../controllers/info";
import walletController from "../controllers/wallet";

import swaggerUi from "swagger-ui-express";
const swaggerDocument = require("../../swagger.json");

const router = express.Router();

router.use("/api-docs", swaggerUi.serve);
router.get("/api-docs", swaggerUi.setup(swaggerDocument));

router.get("/info", infoController.getInfo);

router.get("/:address/balance", walletController.getCurrentBalance);
router.get(
  "/:address/balance/block/:blockNumber",
  walletController.getBalanceAtBlock
);
router.get("/:address/balance/date/:date", walletController.getBalanceAtDate);

export = router;
