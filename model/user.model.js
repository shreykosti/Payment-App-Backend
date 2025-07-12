import mongoose from "mongoose";

const Userschema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  location: { type: String },
  availability: { type: String, enum: ["weekends", "evenings", "anytime"] },
  isPublic: { type: Boolean, default: true },
  skillsOffered: [{ type: String }],
  skillsWanted: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("User", Userschema);
