import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import balence from "../controllers/getballance.controller.js";
import transfer from "../controllers/transfer.controller.js";
const router = Router();
import express from "express";

router.get("/getBallance", authMiddleware, balence);

router.post("/transfer", authMiddleware, transfer);

export default router;
