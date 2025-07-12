import { z } from "zod";
import express from "express";
import User from "../model/user.model.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

import bcrypt from "bcrypt";
const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characterslong"),
  location: z.string().optional(),
  availability: z.enum(["weekends", "evenings", "anytime"]).optional(),
  isPublic: z.boolean().optional(),
  skillsOffered: z.array(z.string()).optional(),
  skillsWanted: z.array(z.string()).optional(),
});

const App = async (req, res) => {
  console.log("insignup controller");
  const validation = userSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: validation.error.errors,
    });
  }
  const {
    name,
    email,
    password,
    location,
    availability,
    isPublic,
    skillsOffered,
    skillsWanted,
  } = req.body;

  const user = new User({
    name: name,
    email: email,
    password: await bcrypt.hash(password, 10),
    location: location || " ",
    availability: availability || "anytime",
    isPublic: isPublic || true,
    skillsOffered: skillsOffered || [],
    skillsWanted: skillsWanted || [],
  });

  user
    .save()
    .then((result) => {
      console.log("User created successfully");
      const userid = user._id;
      const token = jwt.sign({ userid: userid }, process.env.JWT_SECRET);
      res.cookie("token", token, {
        httpOnly: true,
        sameSite: "None",
        secure: true,
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
