import { z } from "zod";
import User from "../model/user.model.js";
const updateSchema = z.object({
  firstname: z.string().min(3).max(20).optional(),
  lastname: z.string().min(3).max(20).optional(),
});
const update = async (req, res) => {
  console.log(req.body);
  const { success } = updateSchema.safeParse(req.body);
  console.log(success);
  if (!success) {
    return res.status(400).json({ message: "Invalid data to update" });
  }
  const id = req.user.id;
  const check = await User.findByIdAndUpdate(id, {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    password: req.body.password,
  });
  if (!check) {
    return res.status(400).json({ message: "User not found" });
  }
  res.json({ message: "Update user" });
};

export default update;
