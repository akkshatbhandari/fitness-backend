import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";
import workoutRoutes from "./routes/workouts.js";
import exerciseRoutes from "./routes/exercises.js";

dotenv.config();
const app = express();
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/workouts", workoutRoutes);
app.use("/exercises", exerciseRoutes);

const PORT = process.env.PORT || 4000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error(err));
