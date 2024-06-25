import { z } from "zod";
import User from "../model/user.model.js";
const updateSchema = z.object({
  firstname: z.string().min(3).max(20).optional(),
  lastname: z.string().min(3).max(20).optional(),
  password: z.string().min(6).max(20).optional(),
});
const update = async (req, res) => {
  const { success } = updateSchema.safeParse(req.body);
  if (!success) {
    return res.status(400).json({ message: "Invalid data" });
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
