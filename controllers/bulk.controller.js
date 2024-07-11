import User from "../model/user.model.js";
const App = async (req, res) => {
  const idcheck = req.user.id;
  console.log("in bulk");
  const inputfilter = req.query.filter;
  console.log(typeof inputfilter);
  if (inputfilter === "") {
    return res.status(400).json({ message: "Please provide a filter" });
  }
  try {
    const user = await User.find({
      $and: [
        {
          _id: { $ne: idcheck }, // Replace ignoreId with the ID you want to ignore
        },
        {
          $or: [
            {
              firstname: {
                $regex: inputfilter,
              },
            },
            {
              lastname: {
                $regex: inputfilter,
              },
            },
            {
              username: {
                $regex: inputfilter,
              },
            },
          ],
        },
      ],
    });
    res.json({
      users: user.map((use) => ({
        firstname: use.firstname,
        lastname: use.lastname,
        username: use.username,
        _id: use._id,
      })),
    });
  } catch (error) {
    res.status(400).json({ message: "Error occured" });
  }
};

export default App;
