import express from "express";
import infoController from "../controllers/info";
import walletController from "../controllers/wallet"
const router = express.Router();

router.get("/info", infoController.getInfo);

router.get("/:address/balance", walletController.getCurrentBalance)
router.get("/:address/balance/block/:blockNumber", walletController.getBalanceAtBlock)
router.get("/:address/balance/date/:date", walletController.getBalanceAtDate)

export = router;
