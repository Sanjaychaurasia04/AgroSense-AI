// src/styles/theme.js

export const theme = {
  // ── Backgrounds ───────────────────────────────────────
  soil:      "#202c21",   // deepest bg — very dark forest green (was cold navy)
  bark:      "#2c4532",   // card/surface bg — dark mossy green
  earth:     "#364f3a",   // elevated surfaces, borders


  // ── Greens (primary palette) ──────────────────────────
  clay:      "#3f7c51",   // mid green — buttons, accents
  wheat:     "#4ade80",   // bright accent green — highlights, active states
  leaf:      "#3a8c52",   // icon green
  sprout:    "#86efac",   // light green — text on dark, badges
  sage:      "#a3f0be",   // very light green — subtle text
  sky:       "#bbf7d0",   // near-white green — muted labels

  // ── Neutrals ──────────────────────────────────────────
  rain:      "#6ee7a0",   // secondary accent
  mist:      "#d1fae5",   // dimmed text, footer
  cream:     "#f0fdf4",   // primary text
  parchment: "#ecfdf5",   // headings, highlights

  // ── Semantic ──────────────────────────────────────────
  alert:     "#f87171",   // red — errors, high severity
  success:   "#4ade80",   // green — success states
  warning:   "#fbbf24",   // amber — medium severity
};

export const severityColor = {
  High:   theme.alert,
  Medium: theme.warning,
  Low:    theme.sprout,
};

export const typeColors = {
  sow:       theme.sprout,
  water:     theme.rain,
  fertilize: theme.warning,
  pest:      theme.alert,
  disease:   theme.alert,
  harvest:   theme.wheat,
};