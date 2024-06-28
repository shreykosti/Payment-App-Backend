import Account from "../model/account.model.js";
import User from "../model/user.model.js";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import zod from "zod";
const App = async (req, res) => {
  console.log("transfer");
  console.log(req.body);
  const balanceSchema = zod.number().positive();
  const toSchema = zod.string();
  const pinSchema = zod.number().int().positive().min(999).max(9999);
  const session = await mongoose.startSession();

  session.startTransaction();
  const amount = parseFloat(req.body.amount);
  const to = req.body.to;
  const pin = req.body.pin;

  const check1 = balanceSchema.safeParse(amount);
  const check2 = toSchema.safeParse(to);
  const check3 = pinSchema.safeParse(pin);

  if (
    check1.success === false ||
    check2.success === false ||
    check3.success === false
  ) {
    await session.abortTransaction();
    return res.status(400).json({
      message: "Invalid Input",
    });
  }
  // Fetch the accounts within the transaction
  const account = await Account.findOne({ userNumber: req.user.id }).session(
    session
  );
  const pinfromdb = await User.findOne({ _id: req.user.id }).session(session);
  const updatepin = pin.toString();
  const check4 = await bcrypt.compare(updatepin, pinfromdb.pin);
  if (!check4) {
    await session.abortTransaction();
    return res.status(400).json({
      message: "Invalid pin",
    });
  }
  if (!account || account.balance < amount) {
    await session.abortTransaction();
    return res.status(400).json({
      message: "Insufficient balance",
    });
  }

  const toAccount = await Account.findOne({ userNumber: to }).session(session);

  if (!toAccount) {
    await session.abortTransaction();
    return res.status(400).json({
      message: "Invalid account",
    });
  }

  // Perform the transfer
  await Account.updateOne(
    { userNumber: req.user.id },
    { $inc: { balance: -amount } }
  ).session(session);
  await Account.updateOne(
    { userNumber: to },
    { $inc: { balance: amount } }
  ).session(session);

  // Commit the transaction
  await session.commitTransaction();
  res.json({
    amount: amount,
    message: "Transfer successful",
  });
};

export default App;
