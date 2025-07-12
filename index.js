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

const mongodburl =
  "mongodb+srv://kostishrey135:zWuWncwCMKEqrpSW@cluster0.vi3fxt4.mongodb.net/";
(() => {
  mongoose
    .connect(mongodburl)
    .then(() => {
      console.log("Connected to database successfully");
    })
    .catch((err) => {
      console.log(`Error connecting to database ${err}`);
    });
})();
// app.use(
//   cors({
//     origin: "https://payment-app-frontend-v1.vercel.app",
//     credentials: true,
//   })
// );
app.use(express.json());
app.use(cookieParser());
//routes
app.use("/api", rout);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// app.use((req, res, next, error) => {
//   res.status(404).json("there is some problem");
//   //next(error);
// });
