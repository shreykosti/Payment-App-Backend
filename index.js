import mongoose from "mongoose";
import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import rout from "./routes/index.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const mongodburl = process.env.MONGOODBCONNECT;
(() => {
  mongoose
    .connect(mongodburl)
    .then(() => {
      console.log("Connected to database");
    })
    .catch((err) => {
      console.log(`Error connecting to database ${err}`);
    }); 
})();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
//routes
app.use("/api/v1", rout);

app.listen(port || 3000, () => {
  console.log(`Server is running on port ${port}`);
});
