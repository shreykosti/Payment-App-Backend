import Account from "../model/account.model.js";
import User from "../model/user.model.js";
const App = async (req, res) => {
  const id = req.user.id;
  console.log(id);
  const Ballance = await Account.findOne({ userNumber: id });
  const uservalue = await User.findOne({ _id: id });
  console.log(Ballance);
  console.log(uservalue);
  res.json({
    Balance: Ballance.balance,
    username: uservalue.username,
    firstname: uservalue.firstname,
    lastname: uservalue.lastname,
  });
};

export default App;
