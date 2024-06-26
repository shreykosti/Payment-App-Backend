import { z } from "zod";
import express from "express";
import User from "../model/user.model.js";
import Account from "../model/account.model.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

import bcrypt from "bcrypt";
const emailschema = z.coerce.string().email().min(3);
const schema = z.string().min(3).max(20);
const App = async (req, res) => {
  console.log("insignup controller");
  const username = req.body.username || " ";
  const firstname = req.body.firstname || " ";
  const lastname = req.body.lastname || " ";
  const password = req.body.password || " ";

  const c1 = emailschema.safeParse(username);
  const c2 = schema.safeParse(firstname);
  const c3 = schema.safeParse(lastname);
  const c4 = schema.safeParse(password);

  if (c1.success === false) {
    res.status(400).json({ status: "error in email" });
    return;
  } else if (c2.success === false) {
    res.status(400).json({ status: "error in firstname" });
    return;
  } else if (c3.success === false) {
    res.status(400).json({ status: "error in lastname" });
    return;
  } else if (c4.success === false) {
    res.status(400).json({ status: "error in password" });
    return;
  }

  const hash = await bcrypt.hashSync(password, 10);

  const user = new User({
    username: username,
    firstname: firstname,
    lastname: lastname,
    password: hash || password,
  });
  console.log(user);
  user
    .save()
    .then((result) => {
      console.log("User created successfully");

      const userid = user._id;

      const account = new Account({
        userNumber: user._id,
        balance: 1 + Math.floor(Math.random() * 100000),
      });
      account
        .save()
        .then((result) => {
          console.log("Account created successfully");
        })

        .catch((err) => {
          res.status(400).json({
            msg: `${err.errorResponse.errmsg} `,
          });
        });
      const token = jwt.sign({ userid: userid }, process.env.JWT_SECRET);
      res.json({
        message: "User created successfully",
        token: token,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({
        msg: `error in input${err.errorResponse.errmsg || "data"}`,
      });
    });
};

export default App;
