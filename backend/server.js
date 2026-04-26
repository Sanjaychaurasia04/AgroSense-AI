// server.js — AgroSense AI
// Merged: Auth0 OTP authentication + MongoDB routes

import "dotenv/config";

import express from "express";
import cors    from "cors";
import fetch   from "node-fetch";

import connectDB from "./config/db.js";
import User      from "./models/User.js";

import userRoutes           from "./routes/users.js";
import detectionRoutes      from "./routes/detections.js";
import recommendationRoutes from "./routes/recommendations.js";
import conversationRoutes   from "./routes/conversations.routes.js";
import communityRoutes      from "./routes/community.routes.js";  // ← NEW

// ── Auth0 config ──────────────────────────────────────────────
const AUTH0_DOMAIN    = "dev-zl6sofbd5sbrdbde.us.auth0.com";
const AUTH0_CLIENT_ID = "yXHFS5b5pvSMFfeu76iCUJCW7kM5ffwH";

// ── Connect MongoDB ───────────────────────────────────────────
connectDB();

const app = express();

// ── Middleware ────────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ── Health check ──────────────────────────────────────────────
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ─────────────────────────────────────────────────────────────
// AUTH0 OTP ROUTES
// ─────────────────────────────────────────────────────────────

// POST /auth/send-otp
app.post("/auth/send-otp", async (req, res) => {
  const { email } = req.body;

  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({
      error: "invalid_email",
      error_description: "A valid email is required.",
    });
  }

  try {
    console.log("📩 Sending OTP to:", email);

    const auth0Res = await fetch(
      `https://${AUTH0_DOMAIN}/passwordless/start`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_id:  AUTH0_CLIENT_ID,
          connection: "email",
          email:      email,
          send:       "code",
        }),
      }
    );

    const data = await auth0Res.json();
    console.log("🔍 Auth0 send-otp response:", data);

    if (!auth0Res.ok) {
      console.error("[send-otp] Auth0 error:", data);
      return res.status(auth0Res.status).json(data);
    }

    return res.json({ ok: true, message: "OTP sent successfully" });
  } catch (err) {
    console.error("[send-otp] Unexpected error:", err);
    return res.status(500).json({
      error: "server_error",
      error_description: "Failed to send OTP",
    });
  }
});

// POST /auth/verify-otp
app.post("/auth/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp || otp.length !== 6) {
    return res.status(400).json({
      error: "invalid_input",
      error_description: "Email and 6-digit OTP required",
    });
  }

  try {
    console.log("🔐 Verifying OTP for:", email);

    const auth0Res = await fetch(
      `https://${AUTH0_DOMAIN}/oauth/token`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          grant_type: "http://auth0.com/oauth/grant-type/passwordless/otp",
          client_id:  AUTH0_CLIENT_ID,
          username:   email,
          otp:        otp,
          realm:      "email",
          scope:      "openid profile email",
        }),
      }
    );

    const data = await auth0Res.json();
    console.log("🔍 Auth0 verify-otp response:", data);

    if (!auth0Res.ok) {
      console.error("[verify-otp] Auth0 error:", data);
      return res.status(auth0Res.status).json(data);
    }

    // ── Decode user info from the id_token JWT payload ────────
    const [, payloadB64] = data.id_token.split(".");
    const profile = JSON.parse(
      Buffer.from(payloadB64, "base64url").toString("utf8")
    );

    const userName  = profile.name || profile.nickname || profile.email;
    const userEmail = profile.email;
    const userSub   = profile.sub;

    // ── Auto-sync user into MongoDB ───────────────────────────
    try {
      const dbUser = await User.findOneAndUpdate(
        { auth0Id: userSub },
        { $set: { name: userName, email: userEmail } },
        { upsert: true, new: true, runValidators: true }
      );
      console.log("✅ User synced to MongoDB:", dbUser._id, userEmail);
    } catch (dbErr) {
      console.error("[verify-otp] MongoDB sync error:", dbErr.message);
    }

    return res.json({
      ok: true,
      user: {
        name:  userName,
        email: userEmail,
        sub:   userSub,
      },
    });
  } catch (err) {
    console.error("[verify-otp] Unexpected error:", err);
    return res.status(500).json({
      error: "server_error",
      error_description: "OTP verification failed",
    });
  }
});

// ─────────────────────────────────────────────────────────────
// MONGODB / API ROUTES
// ─────────────────────────────────────────────────────────────
app.use("/api/users",           userRoutes);
app.use("/api/detections",      detectionRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/conversations",   conversationRoutes);
app.use("/api/community",       communityRoutes);   // ← NEW

// ── 404 handler ───────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ── Global error handler ──────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error" });
});

// ── Listen (local dev) / Export (Vercel) ─────────────────────
const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`AgroSense backend running on port ${PORT}`);
  });
}

export default app;