import User from "../model/user.model.js";
import express from "express";
import { JWT_SECRET } from "../config.js";
import jwt from "jsonwebtoken";
import { z } from "zod";
import bcrypt from "bcrypt";
const App = async (req, res) => {
  console.log("insignin controller");
  const emailschema = z.string().email().min(1);
  const schema = z.string().min(1).max(20);
  const username = req.body.username;
  const password = req.body.password;
  const c1 = emailschema.safeParse(username);
  const c2 = schema.safeParse(password);
  if (c1.success === false || c2.success === false) {
    res.status(400).json({ status: "error while input data" });
    return;
  }

  const check = await User.findOne({
    username: username,
  }).exec();

  const checkpassword = await bcrypt.compare(password, check.password);
  console.log(check, checkpassword)
  if (check && checkpassword) {
    const userid = check._id;
    const tocken = jwt.sign({ userid: userid }, JWT_SECRET);

    res.json({
      message: "User signin successfully",
      token: tocken,
    });
    return;
  }

  res.status(400).json({ message: "User not found" });
};

export default App;
