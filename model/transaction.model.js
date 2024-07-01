import mongoose from "mongoose";
import account from "./account.model.js";
const schema = new mongoose.Schema({
  recived: {
    type: Boolean,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  sendto: {
    type: String,
    required: true,
  },
  month: {
    type: Number,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  day: {
    type: Number,
    required: true,
  },
  hour: {
    type: Number,
    required: true,
  },
  minutes: {
    type: Number,
    required: true,
  },
});
const TransactionSchema = new mongoose.Schema({
  accountnumber: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  transactions: [schema],
});

export default mongoose.model("TransactionHistory", TransactionSchema);
