import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import balence from "../controllers/getballance.controller.js";
import transfer from "../controllers/transfer.controller.js";
import transactionHistory from "../controllers/transctionhistory.js";
const router = Router();
import express from "express";

router.get("/getBallance", authMiddleware, balence);

router.post("/transfer", authMiddleware, transfer);
router.get("/transaction/history", authMiddleware, transactionHistory);

export default router;
