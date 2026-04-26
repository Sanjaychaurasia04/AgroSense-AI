import mongoose from "mongoose";

const detectionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    // Raw disease label from the model e.g. "Tomato___Late_Blight"
    diseaseLabel: {
      type: String,
      required: true,
    },
    // Human-readable name e.g. "Late Blight"
    diseaseName: {
      type: String,
      required: true,
    },
    cropName: {
      type: String,
      required: true,
    },
    confidence: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    isHealthy: {
      type: Boolean,
      required: true,
    },
    treatmentAdvice: {
      type: String,
      default: "",
    },
    // Optional — store image as base64 string or a URL if you use Cloudinary/S3
    imageUrl: {
      type: String,
      default: "",
    },
    location: {
      city: { type: String, default: "" },
      lat: { type: Number, default: null },
      lng: { type: Number, default: null },
    },
  },
  { timestamps: true }
);

// Index for querying a user's detection history sorted by date
detectionSchema.index({ userId: 1, createdAt: -1 });

const Detection = mongoose.model("Detection", detectionSchema);
export default Detection;