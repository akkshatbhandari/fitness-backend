import express from "express";
import Workout from "../models/Workout.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Create Workout
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { title, date, exercises } = req.body;
    const workout = await Workout.create({
      title,
      date,
      user: req.user.id,
      exercises: exercises.map(exId => ({ exercise: exId })),
    });
    res.json(workout);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get upcoming workouts
router.get("/upcoming", authenticateToken, async (req, res) => {
  const workouts = await Workout.find({
    user: req.user.id,
    date: { $gte: new Date() }
  }).populate("exercises.exercise").sort({ date: 1 });

  res.json(workouts);
});

// Report: completion %
router.get("/report", authenticateToken, async (req, res) => {
  const { from, to } = req.query;

  const workouts = await Workout.find({
    user: req.user.id,
    date: { $gte: new Date(from), $lte: new Date(to) }
  });

  let total = 0, completed = 0;
  workouts.forEach(w => {
    w.exercises.forEach(ex => {
      total++;
      if (ex.status === "completed") completed++;
    });
  });

  res.json({ completed, total, percentage: total > 0 ? (completed / total) * 100 : 0 });
});

// Mark exercise as completed
router.patch("/:workoutId/exercise/:exerciseId", authenticateToken, async (req, res) => {
  const { workoutId, exerciseId } = req.params;
  const { status, notes } = req.body;

  const workout = await Workout.findOneAndUpdate(
    { _id: workoutId, "exercises._id": exerciseId, user: req.user.id },
    { $set: { "exercises.$.status": status, "exercises.$.notes": notes } },
    { new: true }
  ).populate("exercises.exercise");

  if (!workout) return res.status(404).json({ error: "Workout or exercise not found" });
  res.json(workout);
});

export default router;
