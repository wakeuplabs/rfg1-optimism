import express from "express";
import infoController from "../controllers/info";

const router = express.Router();

router.get("/info", infoController.getInfo);


export = router;
