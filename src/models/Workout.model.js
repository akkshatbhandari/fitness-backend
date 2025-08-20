import mongoose from "mongoose";

const workoutExerciseSchema = new mongoose.Schema({
  exercise: { type: mongoose.Schema.Types.ObjectId, ref: "Exercise", required: true },
  status: { type: String, enum: ["pending", "completed"], default: "pending" },
  notes: String,
});

const workoutSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  exercises: [workoutExerciseSchema],
}, { timestamps: true });

export default mongoose.model("Workout", workoutSchema);
