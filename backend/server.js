// server.js (FINAL WORKING VERSION)

import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const PORT = 4000;

// 🔥 HARDCODED (for now - debugging)
const AUTH0_DOMAIN = "dev-zl6sofbd5sbrdbde.us.auth0.com";
const AUTH0_CLIENT_ID = "yXHFS5b5pvSMFfeu76iCUJCW7kM5ffwH";

// ── Middleware ────────────────────────────────────
app.use(express.json());
app.use(cors({
  origin: true,
  credentials: true,
}));

// ── Health check ──────────────────────────────────
app.get('/health', (_req, res) => res.json({ ok: true }));

// ── SEND OTP ──────────────────────────────────────
app.post('/auth/send-otp', async (req, res) => {
  const { email } = req.body;

  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({
      error: 'invalid_email',
      error_description: 'A valid email is required.'
    });
  }

  try {
    console.log("📩 Sending OTP to:", email);

    const auth0Res = await fetch(
      `https://${AUTH0_DOMAIN}/passwordless/start`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: AUTH0_CLIENT_ID,
          connection: 'email',
          email: email,
          send: 'code',
        }),
      }
    );

    const data = await auth0Res.json();

    console.log("🔍 Auth0 response:", data);

    if (!auth0Res.ok) {
      console.error('[send-otp] Auth0 error:', data);
      return res.status(auth0Res.status).json(data);
    }

    return res.json({
      ok: true,
      message: 'OTP sent successfully'
    });

  } catch (err) {
    console.error('[send-otp] Unexpected error:', err);
    return res.status(500).json({
      error: 'server_error',
      error_description: 'Failed to send OTP'
    });
  }
});

// ── VERIFY OTP ────────────────────────────────────
app.post('/auth/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp || otp.length !== 6) {
    return res.status(400).json({
      error: 'invalid_input',
      error_description: 'Email and 6-digit OTP required'
    });
  }

  try {
    console.log("🔐 Verifying OTP:", otp);

    const auth0Res = await fetch(
      `https://${AUTH0_DOMAIN}/oauth/token`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grant_type: 'http://auth0.com/oauth/grant-type/passwordless/otp',
          client_id: AUTH0_CLIENT_ID,
          username: email,
          otp: otp,
          realm: 'email',
          scope: 'openid profile email',
        }),
      }
    );

    const data = await auth0Res.json();

    console.log("🔍 Verify response:", data);

    if (!auth0Res.ok) {
      console.error('[verify-otp] Auth0 error:', data);
      return res.status(auth0Res.status).json(data);
    }

    // Decode user info
    const [, payloadB64] = data.id_token.split('.');
    const profile = JSON.parse(
      Buffer.from(payloadB64, 'base64url').toString('utf8')
    );

    return res.json({
      ok: true,
      user: {
        name: profile.name || profile.email,
        email: profile.email,
        sub: profile.sub,
      }
    });

  } catch (err) {
    console.error('[verify-otp] Unexpected error:', err);
    return res.status(500).json({
      error: 'server_error',
      error_description: 'OTP verification failed'
    });
  }
});

// ── START SERVER ──────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});