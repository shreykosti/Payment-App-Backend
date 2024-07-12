import { Router } from "express";
import signup from "../controllers/signup.controller.js";
import signin from "../controllers/signin.controller.js";
import update from "../controllers/update.controller.js";
import bulk from "../controllers/bulk.controller.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import passwordUpdate from "../controllers/passwordUpdate.controller.js";
import Frogetpassword from "../controllers/frogetpassword.controller.js";

const router = Router();

router.post("/signup", signup);
router.post("/signin", signin);
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
router.put("/update", authMiddleware, update);
router.get("/bulk", authMiddleware, bulk);
router.put("/passwordupdate", authMiddleware, passwordUpdate);
router.put("/frogetpassword", Frogetpassword);

export default router;
