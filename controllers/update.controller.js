import { z } from "zod";
import User from "../model/user.model.js";
const updateSchema = z.object({
  location: z.string().optional(),
  availability: z.enum(["weekends", "evenings", "anytime"]).optional(),
  isPublic: z.boolean().optional(),
  skillsOffered: z.array(z.string()).optional(),
  skillsWanted: z.array(z.string()).optional(),
});
const update = async (req, res) => {
  console.log("in update controller");
  const validation = updateSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: validation.error.errors,
    });
  }
  const { location, availability, isPublic, skillsOffered, skillsWanted } =
    req.body;
  const id = req.user.id;
  const check = await User.findByIdAndUpdate(id, {
    location,
    availability,
    isPublic,
    skillsOffered,
    skillsWanted,
  }).exec();

  if (!check) {
    return res.status(400).json({ message: "User not found" });
  }
  res.json({ message: "Update user" });
};

export default update;
