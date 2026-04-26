import mongoose from "mongoose";

const cropRecommendationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    inputs: {
      nitrogen: { type: Number, required: true },
      phosphorus: { type: Number, required: true },
      potassium: { type: Number, required: true },
      temperature: { type: Number, required: true },
      humidity: { type: Number, required: true },
      ph: { type: Number, required: true },
      rainfall: { type: Number, required: true },
    },
    recommendedCrop: {
      type: String,
      required: true,
    },
    season: {
      type: String,
      default: "",
      // e.g. "Kharif 2025", "Rabi 2025"
    },
    notes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

cropRecommendationSchema.index({ userId: 1, createdAt: -1 });

const CropRecommendation = mongoose.model(
  "CropRecommendation",
  cropRecommendationSchema
);
export default CropRecommendation;