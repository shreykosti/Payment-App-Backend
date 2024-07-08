import mongoose from "mongoose";
import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import rout from "./routes/index.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
// const corsOptions = {
//   origin: "https://frountend-eight.vercel.app/",
//   optionSuccessStatus: 200,
// };

const mongodburl = process.env.MONGOODBCONNECT;
(() => {
  mongoose
    .connect(mongodburl)
    .then(() => {
      console.log(
        "Connected to database successfully"
      );
    })
    .catch((err) => {
      console.log(`Error connecting to database ${err}`);
    });
})();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
//routes
app.use("/api/v1", rout);
 
app.listen(port || 3000, () => {
  console.log(`Server is running on port ${port}`);
});
