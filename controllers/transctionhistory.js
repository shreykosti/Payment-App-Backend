import TransactionHistory from "../model/transaction.model.js";

const App = async (req, res) => {
  console.log("transaction history");
  const user = req.user.id;
  console.log(user);
  const transaction = await TransactionHistory.findOne({
    accountnumber: user,
  });
  if (!transaction) {
    return res.status(400).json({
      message: "No transaction found",
    });
  }
  return res.status(200).json({
    message: "Transaction history",
    transaction: transaction.transactions,
  });
};

export default App;
