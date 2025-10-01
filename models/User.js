// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true } // mot de passe hashé
}, { timestamps: true });

export default mongoose.model("User", userSchema);