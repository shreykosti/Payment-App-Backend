import mongoose from "mongoose";

const Userschema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
    trim: true,
    min: 3,
    max: 20,
  },
  lastname: {
    type: String,
    required: true,
    trim: true,
    min: 3,
    max: 20,
  },
  password: {
    type: String,
    required: true,
    trim: true,
    min: 6,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  pin: {
    type: String,
    required: true,
    trim: true,
  },
  Darkmode: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model("User", Userschema);
