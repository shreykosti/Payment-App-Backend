import Account from "../model/account.model.js";
import mongoose from "mongoose";
import zod from "zod";
const App = async (req, res) => {
  const balanceSchema = zod.number().positive();
  const toSchema = zod.string();
  const session = await mongoose.startSession();

  session.startTransaction();
  const { amount, to } = req.body;
  const check1 = balanceSchema.safeParse(amount);
  const check2 = toSchema.safeParse(to);
  if (check1.success === false || check2.success === false) {
    await session.abortTransaction();
    return res.status(400).json({
      message: "Invalid amount",
    });
  }
  // Fetch the accounts within the transaction
  const account = await Account.findOne({ userNumber: req.user.id }).session(
    session
  );
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
