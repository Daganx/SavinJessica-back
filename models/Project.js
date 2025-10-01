// models/Project.js
import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  prestation: String,
  images: { type: [String], default: [] }, // tableau d'URLs
  customer: String,
  year: String,
  price: String,
  time: String,
  need: String,
  place: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }
}, { timestamps: true });

export default mongoose.model("Project", projectSchema);
