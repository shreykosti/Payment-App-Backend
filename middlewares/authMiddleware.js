import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const authMiddleware = (req, res, next) => {
  console.log("auth middleware");
  const authHeader = req.headers.authorization;
  console.log(authHeader);
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("no token");
    return res.status(401).json({
      message: "Access denied. No token provided",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
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
