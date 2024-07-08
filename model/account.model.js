import mongoose from "mongoose";
import User from "./user.model.js";

const Useraccount = new mongoose.Schema(
  {
    userNumber: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      requied: true,
    },
    balance: {
      type: Number,
      requied: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("account", Useraccount);
