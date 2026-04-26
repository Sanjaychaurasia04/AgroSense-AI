// src/utils/db.js
// All frontend ↔ Express backend calls.
// Import and use these functions in your React components/pages.

const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

// ─── Helpers ────────────────────────────────────────────────────────────────

const request = async (method, path, body) => {
  const options = {
    method,
    headers: { "Content-Type": "application/json" },
  };
  if (body) options.body = JSON.stringify(body);

  const res = await fetch(`${BASE_URL}${path}`, options);
  const data = await res.json();

  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
};

// ─── Users ──────────────────────────────────────────────────────────────────

/**
 * Call this immediately after Auth0 login to sync the user into MongoDB.
 * @param {{ sub: string, name: string, email: string }} auth0User — from useAuth0()
 */
export const syncUser = (auth0User) =>
  request("POST", "/api/users/sync", {
    auth0Id: auth0User.sub,
    name: auth0User.name,
    email: auth0User.email,
  });

export const getUser = (auth0Id) =>
  request("GET", `/api/users/${auth0Id}`);

export const updateUser = (auth0Id, updates) =>
  request("PATCH", `/api/users/${auth0Id}`, updates);

// ─── Disease Detections ─────────────────────────────────────────────────────

/**
 * Save a disease detection result.
 * @param {string} auth0Id
 * @param {{ diseaseLabel, confidence, isHealthy, treatmentAdvice, imageUrl?, location? }} result
 */
export const saveDetection = (auth0Id, result) =>
  request("POST", "/api/detections", { auth0Id, ...result });

/**
 * Fetch a user's detection history.
 * @param {string} auth0Id
 * @param {{ page?: number, limit?: number }} opts
 */
export const getDetections = (auth0Id, { page = 1, limit = 20 } = {}) =>
  request("GET", `/api/detections/${auth0Id}?page=${page}&limit=${limit}`);

export const deleteDetection = (id) =>
  request("DELETE", `/api/detections/${id}`);

// ─── Crop Recommendations ───────────────────────────────────────────────────

/**
 * Save a crop recommendation.
 * @param {string} auth0Id
 * @param {{ inputs, recommendedCrop, season?, notes? }} data
 */
export const saveRecommendation = (auth0Id, data) =>
  request("POST", "/api/recommendations", { auth0Id, ...data });

export const getRecommendations = (auth0Id, { page = 1, limit = 20 } = {}) =>
  request("GET", `/api/recommendations/${auth0Id}?page=${page}&limit=${limit}`);

export const deleteRecommendation = (id) =>
  request("DELETE", `/api/recommendations/${id}`);

// ─── Chatbot Conversations ──────────────────────────────────────────────────

/**
 * Save a full conversation after it ends (or when the user bookmarks it).
 * @param {string} auth0Id
 * @param {{ messages: Array<{role, content}>, topic?: string }} data
 */
export const saveConversation = (auth0Id, data) =>
  request("POST", "/api/conversations", { auth0Id, ...data });

/**
 * Append new messages to an existing conversation.
 * @param {string} conversationId — MongoDB _id
 * @param {Array<{role, content}>} messages
 */
export const appendMessages = (conversationId, messages) =>
  request("PATCH", `/api/conversations/${conversationId}/messages`, { messages });

/** Toggle the bookmark/save flag on a conversation. */
export const toggleSaveConversation = (conversationId) =>
  request("PATCH", `/api/conversations/${conversationId}/save`, {});

/**
 * Fetch conversations for a user.
 * @param {string} auth0Id
 * @param {{ savedOnly?: boolean }} opts
 */
export const getConversations = (auth0Id, { savedOnly = false } = {}) =>
  request("GET", `/api/conversations/${auth0Id}?saved=${savedOnly}`);

export const deleteConversation = (id) =>
  request("DELETE", `/api/conversations/${id}`);