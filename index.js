import mongoose from "mongoose";
// import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import rout from "./routes/index.js";
const app = express();
const port = process.env.PORT || 3000;
(() => {
  mongoose
    .connect(
      "mongodb+srv://shreykosti0:6dtPr8glG7ZkWh9S@cluster0.zu6ocfp.mongodb.net/paytm"
    )
    .then(() => {
      console.log("Connected to database");
    })
    .catch((err) => {
      console.log(`Error connecting to database ${err}`);
    });
})();
// app.use(cors());
app.use(express.json());
app.use(cookieParser());
//routes
app.use("/api/v1", rout);

app.listen(port || 3000, () => {
  console.log(`Server is running on port ${port}`);
});
