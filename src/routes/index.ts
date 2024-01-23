/* eslint-disable @typescript-eslint/no-var-requires */
import express from "express";
import infoController from "../controllers/info";
import walletController from "../controllers/wallet";
import contractController from "../controllers/contract";

const router = express.Router();

// === Info ===
router.get("/info", infoController.getInfo);

// === Wallet ===
router.get("/:address/balance", walletController.getCurrentBalance);
router.get(
  "/:address/balance/block/:blockNumber",
  walletController.getBalanceAtBlock
);
router.get("/:address/balance/date/:date", walletController.getBalanceAtDate);

// === Smart Contract ===
router.put("/:address/query", contractController.queryContract);
router.put("/:address/queryKnownABI", contractController.queryKnownABI);
router.get("/:address/functionsKnownABI", contractController.getFunctionsKnownABI);

// === Most Popular Contract ===
router.get("/mostPopular", contractController.getMostPopular);

export = router;
