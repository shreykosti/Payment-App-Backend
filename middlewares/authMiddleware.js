import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const authMiddleware = (req, res, next) => {
  console.log("auth middleware");
  const authHeader = req.cookies.tocken;
  console.log(authHeader);
  if (!authHeader) {
    console.log("no token");
    return res.status(401).json({
      message: "Access denied. No token provided",
    });
  }

  try {
    const decoded = jwt.verify(authHeader, process.env.JWT_SECRET);
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
