import express from "express";
import Exercise from "../models/Exercise.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Get all exercises
router.get("/", async (req, res) => {
  const exercises = await Exercise.find();
  res.json(exercises);
});

// Add custom exercise
router.post("/", authenticateToken, async (req, res) => {
  const { name, description } = req.body;
  const exercise = await Exercise.create({
    name,
    description,
    createdBy: req.user.id,
  });
  res.json(exercise);
});

export default router;
