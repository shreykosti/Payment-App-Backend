import Account from "../model/account.model.js";
import User from "../model/user.model.js";
import TransactionHistory from "../model/transaction.model.js";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import zod from "zod";
const App = async (req, res) => {
  console.log("transfer");
  const balanceSchema = zod.number().positive();
  const toSchema = zod.string();
  const pinSchema = zod.number().int().positive().min(999).max(9999);
  const session = await mongoose.startSession();

  session.startTransaction();
  const amount = parseFloat(req.body.amount);
  const to = req.body.to; //to ki _id
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
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const account = await Account.findOne({ userNumber: req.user.id }).session(
    session
  );
  const senderD = await User.findOne({ _id: req.user.id }).session(session);
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const senderTransactionHistoryid = await TransactionHistory.findOne({
    accountnumber: req.user.id,
  }).session(session);

  const sendtousername = senderD.username;
  const sendtofirstname = senderD.firstname;
  const sendtolastname = senderD.lastname;

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
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const toAccount = await Account.findOne({ userNumber: to }).session(session);

  if (!toAccount) {
    await session.abortTransaction();
    return res.status(400).json({
      message: "Invalid account",
    });
  }
  const toD = await User.findOne({ _id: to }).session(session);
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const toTransactionHistoryid = await TransactionHistory.findOne({
    accountnumber: to,
  }).session(session);

  const tousername = toD.username;
  const tofirstname = toD.firstname;
  const tolastname = toD.lastname;
  // Perform the transfer

  console.log(senderTransactionHistoryid.transactions);

  const senderpushData = {
    recived: false,
    amount: amount,
    sendto: tousername,
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
    day: new Date().getDate(),
    hour: new Date().getHours(),
    minutes: new Date().getMinutes(),
  };

  const topushData = {
    recived: true,
    amount: amount,
    sendto: sendtousername,
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
    day: new Date().getDate(),
    hour: new Date().getHours(),
    minutes: new Date().getMinutes(),
  };

  await TransactionHistory.findOneAndUpdate(
    { accountnumber: req.user.id },
    { $push: { transactions: senderpushData } }
  );
  await TransactionHistory.findOneAndUpdate(
    { accountnumber: to },
    { $push: { transactions: topushData } }
  );
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
