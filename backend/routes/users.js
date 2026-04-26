import express from "express";
import User from "../models/User.js";

const router = express.Router();

// POST /api/users/sync
// Called right after Auth0 login to upsert the user into MongoDB.
// Body: { auth0Id, name, email }
router.post("/sync", async (req, res) => {
  try {
    const { auth0Id, name, email } = req.body;

    if (!auth0Id || !name || !email) {
      return res.status(400).json({ error: "auth0Id, name and email are required" });
    }

    const user = await User.findOneAndUpdate(
      { auth0Id },
      { $set: { name, email } },
      { upsert: true, new: true, runValidators: true }
    );

    res.status(200).json({ success: true, user });
  } catch (err) {
    console.error("User sync error:", err);
    res.status(500).json({ error: "Failed to sync user" });
  }
});

// GET /api/users/:auth0Id
router.get("/:auth0Id", async (req, res) => {
  try {
    const user = await User.findOne({ auth0Id: req.params.auth0Id });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

// PATCH /api/users/:auth0Id — update location / preferences
router.patch("/:auth0Id", async (req, res) => {
  try {
    const allowed = ["location", "preferredLanguage", "savedWeatherLocations", "lastWeatherCity"];
    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    const user = await User.findOneAndUpdate(
      { auth0Id: req.params.auth0Id },
      { $set: updates },
      { new: true }
    );

    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ error: "Failed to update user" });
  }
});

export default router;