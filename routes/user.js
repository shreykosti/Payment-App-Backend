import { Router } from "express";
import signup from "../controllers/signup.controller.js";
import signin from "../controllers/signin.controller.js";
import update from "../controllers/update.controller.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import bulk from "../controllers/bulk.controller.js";
import dotenv from "dotenv";
dotenv.config();
const router = Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/update", authMiddleware, update);
router.get("/bulk", bulk);
router.post("/logout", (req, res) => {
  res.cookie("tocken", "", {
    httpOnly: true,
    sameSite: "None",
    expires: new Date(0),
    secure: true,
  });
  res.json({
    message: "User signout successfully",
  });
});

export default router;
