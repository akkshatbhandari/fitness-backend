import mongoose from "mongoose";

const exerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // custom exercise
}, { timestamps: true });

export default mongoose.model("Exercise", exerciseSchema);
