import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config.js";

const authMiddleware = (req, res, next) => {
  console.log("auth middleware");
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(403).json({
      message: "Access denied. No token provided",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const id = decoded.userid;
    req.user = { id: id };
    next();
  } catch (err) {
    return res.status(403).json({
      message: "Invalid token",
    });
  }
};

export default authMiddleware;
