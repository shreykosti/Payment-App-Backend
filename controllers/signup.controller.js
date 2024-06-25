import { z } from "zod";
import express from "express";
import User from "../model/user.model.js";
import Account from "../model/account.model.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config.js";
import bcrypt from "bcrypt";
const emailschema = z.coerce.string().email().min(1);
const schema = z.string().min(1).max(20);
const App = async (req, res) => {
  const username = req.body.username;
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const password = req.body.password;

  const c1 = emailschema.safeParse(username);
  const c2 = schema.safeParse(firstname);
  const c3 = schema.safeParse(lastname);
  const c4 = schema.safeParse(password);
  if (
    c1.success === false ||
    c2.success === false ||
    c3.success === false ||
    c4.success === false
  ) {
    res.status(400).json({ status: "error while input data" });
    return;
  }

  const hash = await bcrypt.hashSync(password, 10);

  const user = new User({
    username: username,
    firstname: firstname,
    lastname: lastname,
    password: hash || password,
  });

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
            msg: `error while creating data ${err.errorResponse.errmsg}`,
          });
        });
      const token = jwt.sign({ userid: userid }, JWT_SECRET);
      res.json({
        message: "User created successfully",
        token: token,
      });
    })
    .catch((err) => {
      console.log(err);
      res
        .status(400)
        .json({ msg: `error while saving data ${err.errorResponse.errmsg}` });
    });
};

export default App;
