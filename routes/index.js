import { Router } from "express";
import express from "express";
import userRouter from "./user.js";
import dotenv from "dotenv";
dotenv.config();

const router = Router();

router.use("/user", userRouter);

export default router;
