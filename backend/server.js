// server.js — AgroSense AI (Vercel Ready)

import "dotenv/config";

import express from "express";
import cors from "cors";
import fetch from "node-fetch";

import connectDB from "./config/db.js";
import User from "./models/User.js";

import userRoutes from "./routes/users.js";
import detectionRoutes from "./routes/detections.js";
import recommendationRoutes from "./routes/recommendations.js";
import conversationRoutes from "./routes/conversations.routes.js";
import communityRoutes from "./routes/community.routes.js";

// ── Auth0 config ──────────────────────────────────────────────
const AUTH0_DOMAIN = "dev-zl6sofbd5sbrdbde.us.auth0.com";
const AUTH0_CLIENT_ID = "yXHFS5b5pvSMFfeu76iCUJCW7kM5ffwH";

const app = express();

// ── CORS (FIXED) ──────────────────────────────────────────────
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://agro-sense-ai-smoky.vercel.app",
    ],
    credentials: true,
  })
);

// ── Body Parser ───────────────────────────────────────────────
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));

// ── MongoDB Connection Middleware (CRITICAL FIX) ──────────────
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("❌ DB connection failed:", err.message);
    return res.status(500).json({ error: "Database connection failed" });
  }
});

// ── Health Check ──────────────────────────────────────────────
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ─────────────────────────────────────────────────────────────
// AUTH0 OTP ROUTES
// ─────────────────────────────────────────────────────────────

// Send OTP
app.post("/auth/send-otp", async (req, res) => {
  const { email } = req.body;

  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({
      error: "invalid_email",
      error_description: "A valid email is required.",
    });
  }

  try {
    const auth0Res = await fetch(
      `https://${AUTH0_DOMAIN}/passwordless/start`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_id: AUTH0_CLIENT_ID,
          connection: "email",
          email: email,
          send: "code",
        }),
      }
    );

    const data = await auth0Res.json();

    if (!auth0Res.ok) {
      console.error("Auth0 send OTP error:", data);
      return res.status(auth0Res.status).json(data);
    }

    return res.json({ ok: true, message: "OTP sent successfully" });
  } catch (err) {
    console.error("Send OTP error:", err);
    return res.status(500).json({ error: "Failed to send OTP" });
  }
});

// Verify OTP
app.post("/auth/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp || otp.length !== 6) {
    return res.status(400).json({
      error: "invalid_input",
      error_description: "Email and 6-digit OTP required",
    });
  }

  try {
    const auth0Res = await fetch(
      `https://${AUTH0_DOMAIN}/oauth/token`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          grant_type:
            "http://auth0.com/oauth/grant-type/passwordless/otp",
          client_id: AUTH0_CLIENT_ID,
          username: email,
          otp: otp,
          realm: "email",
          scope: "openid profile email",
        }),
      }
    );

    const data = await auth0Res.json();

    if (!auth0Res.ok) {
      console.error("Auth0 verify error:", data);
      return res.status(auth0Res.status).json(data);
    }

    // Decode JWT
    const [, payloadB64] = data.id_token.split(".");
    const profile = JSON.parse(
      Buffer.from(payloadB64, "base64url").toString("utf8")
    );

    const userName = profile.name || profile.nickname || profile.email;
    const userEmail = profile.email;
    const userSub = profile.sub;

    // Save user to MongoDB
    try {
      await User.findOneAndUpdate(
        { auth0Id: userSub },
        { $set: { name: userName, email: userEmail } },
        { upsert: true, new: true }
      );
    } catch (dbErr) {
      console.error("Mongo user sync error:", dbErr.message);
    }

    return res.json({
      ok: true,
      user: {
        name: userName,
        email: userEmail,
        sub: userSub,
      },
    });
  } catch (err) {
    console.error("Verify OTP error:", err);
    return res.status(500).json({ error: "OTP verification failed" });
  }
});

// ─────────────────────────────────────────────────────────────
// API ROUTES
// ─────────────────────────────────────────────────────────────
app.use("/api/users", userRoutes);
app.use("/api/detections", detectionRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/community", communityRoutes);

// ── 404 Handler ───────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ── Global Error Handler ──────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error("Server error:", err.stack);
  res.status(500).json({ error: "Internal server error" });
});

// ── Export for Vercel (IMPORTANT) ─────────────────────────────
export default app;

// ── Local Dev Only ────────────────────────────────────────────
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}