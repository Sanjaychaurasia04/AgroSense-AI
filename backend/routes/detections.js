import express from "express";
import Detection from "../models/Detection.js";
import User from "../models/User.js";

const router = express.Router();

// Helper: parse "Tomato___Late_Blight" → { cropName: "Tomato", diseaseName: "Late Blight" }
const parseLabel = (label = "") => {
  const [crop, ...rest] = label.split("___");
  const disease = rest.join(" ").replace(/_/g, " ");
  return {
    cropName: crop || "Unknown",
    diseaseName: disease || "Unknown",
  };
};

// POST /api/detections
// Save a new disease detection result.
// Body: { auth0Id, diseaseLabel, confidence, isHealthy, treatmentAdvice, imageUrl?, location? }
router.post("/", async (req, res) => {
  try {
    const {
      auth0Id,
      diseaseLabel,
      confidence,
      isHealthy,
      treatmentAdvice,
      imageUrl,
      location,
    } = req.body;

    if (!auth0Id || !diseaseLabel || confidence === undefined) {
      return res.status(400).json({ error: "auth0Id, diseaseLabel and confidence are required" });
    }

    const user = await User.findOne({ auth0Id });
    if (!user) return res.status(404).json({ error: "User not found. Sync user first." });

    const { cropName, diseaseName } = parseLabel(diseaseLabel);

    const detection = await Detection.create({
      userId: user._id,
      diseaseLabel,
      diseaseName,
      cropName,
      confidence,
      isHealthy: isHealthy ?? diseaseName.toLowerCase().includes("healthy"),
      treatmentAdvice: treatmentAdvice || "",
      imageUrl: imageUrl || "",
      location: location || {},
    });

    res.status(201).json({ success: true, detection });
  } catch (err) {
    console.error("Save detection error:", err);
    res.status(500).json({ error: "Failed to save detection" });
  }
});

// GET /api/detections/:auth0Id — fetch user's detection history
router.get("/:auth0Id", async (req, res) => {
  try {
    const user = await User.findOne({ auth0Id: req.params.auth0Id });
    if (!user) return res.status(404).json({ error: "User not found" });

    const limit = parseInt(req.query.limit) || 20;
    const page  = parseInt(req.query.page)  || 1;
    const skip  = (page - 1) * limit;

    const [detections, total] = await Promise.all([
      Detection.find({ userId: user._id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Detection.countDocuments({ userId: user._id }),
    ]);

    res.json({ success: true, total, page, detections });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch detections" });
  }
});

// DELETE /api/detections/:id — delete a single detection by its MongoDB _id
router.delete("/:id", async (req, res) => {
  try {
    await Detection.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete detection" });
  }
});

export default router;