import User from "../model/user.model.js";
import { z } from "zod";
import bcrypt from "bcrypt";
export default async function passwordUpdate(req, res) {
  const schema = z.object({
    oldPassword: z.string().min(6).max(20),
    newPassword: z.string().min(6).max(20),
    pin: z.number().int().positive().min(999).max(9999),
  });
  const { oldPassword, newPassword, pin } = req.body;

  const sucess = schema.safeParse({ oldPassword, newPassword, pin }).success;

  if (!sucess) {
    res.status(400).send("invalid input");
    return;
  }

  const dbCall1 = await User.findById(req.user.id);
  if (!dbCall1) {
    res.status(400).send("user not found");
    return;
  }

  const dBoldPassword = dbCall1.password;
  const isValidPassword = await bcrypt.compare(oldPassword, dBoldPassword);
  const dBpin = dbCall1.pin;
  const stringPin = pin.toString();
  const isValidPin = await bcrypt.compare(stringPin, dBpin);
  console.log(isValidPassword);
  if (!isValidPassword || !isValidPin) {
    res.status(400).send("wrong password or pin");
    return;
  }

  if (oldPassword === newPassword) {
    res.status(400).send("old password and new password are same");
    return;
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  const dBcall2 = await User.findByIdAndUpdate(req.user.id, {
    password: hashedPassword,
  });
  console.log(dBcall2);
  if (!dBcall2) {
    res.status(400).send("password not updated");
    return;
  }

  res.status(200).send("password updated successfully");
}
