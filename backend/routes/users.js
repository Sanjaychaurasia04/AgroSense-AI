import express from "express";
import User from "../models/User.js";

const router = express.Router();

// POST /api/users/sync
// Called after ANY Auth0 login (OTP or Google) to upsert the user into MongoDB.
// Body: { auth0Id, name, email, picture? }
// Note: `name` falls back to the part before @ in email if not provided,
// which can happen with some Google accounts on first login.
router.post("/sync", async (req, res) => {
  try {
    const { auth0Id, name, email, picture } = req.body;

    if (!auth0Id || !email) {
      return res.status(400).json({ error: "auth0Id and email are required" });
    }

    // Derive a display name if Auth0 didn't send one (edge case with Google)
    const resolvedName = name?.trim() || email.split("@")[0];

    const updateFields = {
      name: resolvedName,
      email: email.toLowerCase(),
    };

    // Store profile picture if provided (Google sends this, OTP doesn't)
    if (picture) {
      updateFields.picture = picture;
    }

    const user = await User.findOneAndUpdate(
      { auth0Id },
      { $set: updateFields },
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