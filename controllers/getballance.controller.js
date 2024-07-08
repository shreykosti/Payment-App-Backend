import Account from "../model/account.model.js";
import User from "../model/user.model.js";
const App = async (req, res) => {
  console.log("getballance controller");
  const id = req.user.id;
  const Ballance = await Account.findOne({ userNumber: id });
  const uservalue = await User.findOne({ _id: id });
  res.json({
    Balance: Ballance.balance,
    username: uservalue.username,
    firstname: uservalue.firstname,
    lastname: uservalue.lastname,
  });
};

export default App;
