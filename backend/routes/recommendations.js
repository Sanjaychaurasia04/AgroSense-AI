import express from "express";
import CropRecommendation from "../models/CropRecommendation.js";
import User from "../models/User.js";

const router = express.Router();

// POST /api/recommendations
// Body: { auth0Id, inputs: { nitrogen, phosphorus, potassium, temperature, humidity, ph, rainfall }, recommendedCrop, season? }
router.post("/", async (req, res) => {
  try {
    const { auth0Id, inputs, recommendedCrop, season, notes } = req.body;

    if (!auth0Id || !inputs || !recommendedCrop) {
      return res.status(400).json({ error: "auth0Id, inputs and recommendedCrop are required" });
    }

    const requiredInputs = ["nitrogen", "phosphorus", "potassium", "temperature", "humidity", "ph", "rainfall"];
    for (const field of requiredInputs) {
      if (inputs[field] === undefined) {
        return res.status(400).json({ error: `Missing input field: ${field}` });
      }
    }

    const user = await User.findOne({ auth0Id });
    if (!user) return res.status(404).json({ error: "User not found. Sync user first." });

    const recommendation = await CropRecommendation.create({
      userId: user._id,
      inputs,
      recommendedCrop,
      season: season || "",
      notes: notes || "",
    });

    res.status(201).json({ success: true, recommendation });
  } catch (err) {
    console.error("Save recommendation error:", err);
    res.status(500).json({ error: "Failed to save recommendation" });
  }
});

// GET /api/recommendations/:auth0Id
router.get("/:auth0Id", async (req, res) => {
  try {
    const user = await User.findOne({ auth0Id: req.params.auth0Id });
    if (!user) return res.status(404).json({ error: "User not found" });

    const limit = parseInt(req.query.limit) || 20;
    const page  = parseInt(req.query.page)  || 1;
    const skip  = (page - 1) * limit;

    const [recommendations, total] = await Promise.all([
      CropRecommendation.find({ userId: user._id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      CropRecommendation.countDocuments({ userId: user._id }),
    ]);

    res.json({ success: true, total, page, recommendations });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch recommendations" });
  }
});

// DELETE /api/recommendations/:id
router.delete("/:id", async (req, res) => {
  try {
    await CropRecommendation.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete recommendation" });
  }
});

export default router;