import User from "../model/user.model.js";
import express from "express";
import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
import { z } from "zod";
import bcrypt from "bcrypt";

const App = async (req, res) => {
  console.log("insignin controller");
  const emailschema = z.string().email().min(3);
  const schema = z.string().min(3).max(20);
  const username = req.body.username || " ";
  const password = req.body.password || " ";
  const c1 = emailschema.safeParse(username);
  const c2 = schema.safeParse(password);
  if (c1.success === false) {
    res.status(400).send("Invalid email🧐🧐");
    return;
  } else if (c2.success === false) {
    res.status(400).send("Invalid password🧐🧐");
    return;
  }

  const check = await User.findOne({
    username: username,
  }).exec();

  if (!check) {
    res.status(400).send("User not found");
    return;
  }
  const checkpassword = await bcrypt.compare(password, check.password);

  if (check && checkpassword) {
    const userid = check._id;
    const tocken = jwt.sign({ userid: userid }, process.env.JWT_SECRET);
    res.cookie("tocken", tocken, {
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });
    res.json({
      message: "User signin successfully",
    });
    return;
  }

  res.status(400).send("User not found");
};

export default App;
