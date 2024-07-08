import { Router } from "express";
import signup from "../controllers/signup.controller.js";
import signin from "../controllers/signin.controller.js";
import update from "../controllers/update.controller.js";
import bulk from "../controllers/bulk.controller.js";
import authMiddleware from "../middlewares/authMiddleware.js";
const router = Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/logout", (req, res) => {
  res.clearCookie("tocken");
  res.json({
    message: "User signout successfully",
  });
});
router.put("/update", authMiddleware, update);
router.get("/bulk", authMiddleware, bulk);

export default router;
