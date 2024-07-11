import { z } from "zod";
import express from "express";
import User from "../model/user.model.js";
import Account from "../model/account.model.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import TransactionHistory from "../model/transaction.model.js";
dotenv.config();

import bcrypt from "bcrypt";
const emailschema = z.coerce.string().email().min(3);
const schema = z.string().min(3).max(20);
const pinSchema = z.number().int().positive().min(999).max(9999);
const App = async (req, res) => {
  console.log("insignup controller");
  const username = req.body.username || " ";
  const firstname = req.body.firstname || " ";
  const lastname = req.body.lastname || " ";
  const password = req.body.password || " ";
  const pin = req.body.pin || " ";
  const amount = 1 + Math.floor(Math.random() * 100000);
  const c1 = emailschema.safeParse(username);
  const c2 = schema.safeParse(firstname);
  const c3 = schema.safeParse(lastname);
  const c4 = schema.safeParse(password);
  const c5 = pinSchema.safeParse(pin);
  if (c1.success === false) {
    res.status(400).send("invalid email🧐🧐");
    return;
  } else if (c2.success === false) {
    res.status(400).send("invalid firstname🧐🧐");
    return;
  } else if (c3.success === false) {
    res.status(400).send("invalid lastname🧐🧐");
    return;
  } else if (c4.success === false) {
    res.status(400).send("invalid password🧐🧐");
    return;
  } else if (c5.success === false) {
    res.status(400).send("invalid pin🧐🧐");
    return;
  }
  const updatepin = pin.toString();
  const hash1 = bcrypt.hashSync(password, 10);
  const hash2 = bcrypt.hashSync(updatepin, 10);
  const user = new User({
    username: username,
    firstname: firstname,
    lastname: lastname,
    password: hash1 || password,
    pin: hash2 || pin,
  });

  user
    .save()
    .then((result) => {
      console.log("User created successfully");

      const userid = user._id;

      const account = new Account({
        userNumber: user._id,
        balance: amount,
      });
      account
        .save()
        .then((result) => {
          console.log("Account created successfully");
          const date = new Date();
          const transactionHistory = new TransactionHistory({
            accountnumber: user._id,
            transactions: [
              {
                recived: true,
                amount: amount,
                sendto: "self",
                month: date.getMonth(),
                year: date.getFullYear(),
                day: date.getDate(),
                hour: date.getHours(),
                minutes: date.getMinutes(),
              },
            ],
          });
          transactionHistory
            .save()
            .then((result) => {
              console.log("TransactionHistory created successfully");
            })
            .catch((err) => {
              console.log(err);
              res.status(400).send(err.errorResponse.errmsg);
            });
        })

        .catch((err) => {
          console.log(err);
          res.status(400).send(err.errorResponse.errmsg);
        });
      const token = jwt.sign({ userid: userid }, process.env.JWT_SECRET);
      res.cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
      });
      res.json({
        message: "User created successfully",
      });
    })
    .catch((err) => {
      console.log(err);
      res
        .status(400)
        .send(
          err.errorResponse.errmsg
            .split(":")[2]
            .replace("username_1 dup key", " Email already exists")
        );
    });
};

export default App;
