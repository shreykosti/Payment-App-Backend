import User from "../model/user.model.js";

const App = async (req, res) => {
  const userdata = await User.find({
    isPublic: true,
  });

  return res.status(200).json({
    message: "User data fetched successfully",
    users: userdata.map((user) => ({
      name: user.name,
      email: user.email,
      location: user.location,
      availability: user.availability,
      skillsOffered: user.skillsOffered,
      skillsWanted: user.skillsWanted,
      id: user._id,
    })),
  });
};

export default App;
