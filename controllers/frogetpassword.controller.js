import User from "../model/user.model.js";
import z from "zod";
import bcrypt from "bcrypt";
export default async function Frogetpassword(req, res) {
  const { username, pin, password } = req.body;

  const schema = z.object({
    username: z.string().email().min(3),
    pin: z.number().int().positive().min(999).max(9999),
    password: z.string().min(3).max(20),
  });

  const check = schema.safeParse({ username, pin, password });
  if (!check.success) {
    return res.status(400).send("Error in Input values");
  }

  const pinstring = pin.toString();

  const hashpassword = bcrypt.hashSync(password, 10);

  const dbcall1 = await User.findOne({ username: username });
  const dbpin = dbcall1.pin;
  const dbpassword = dbcall1.password;
  const check1 = await bcrypt.compare(password, dbpassword);
  const check2 = await bcrypt.compare(pinstring, dbpin);
  if (check1) {
    return res.status(400).send("Password cannot be same as previous password");
  }
  if (!check2) {
    return res.status(400).send("Invalid pin");
  }

  const dbcall2 = await User.findOneAndUpdate(
    { username: username },
    { password: hashpassword }
  );

  if (!dbcall2) {
    return res.status(400).send("User not found");
  }

  res.status(200).send("password updated successfully");
}
