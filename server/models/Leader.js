import mongoose from "mongoose";

const leaderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    position: {
      type: String,
      required: true,
      trim: true,
    },

    imageUrl: {
      type: String,
      default: "",
    },

    shortIntro: {
      type: String,
      default: "",
      trim: true,
    },

    biography: {
      type: String,
      default: "",
      trim: true,
    },

    dateOfBirth: {
      type: String,
      default: "",
    },

    education: {
      type: String,
      default: "",
      trim: true,
    },

    currentPosition: {
      type: String,
      default: "",
      trim: true,
    },

    area: {
      type: String,
      default: "",
      trim: true,
    },

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    email: {
      type: String,
      default: "",
      trim: true,
    },

    facebook: {
      type: String,
      default: "",
      trim: true,
    },

    instagram: {
      type: String,
      default: "",
      trim: true,
    },

    twitter: {
      type: String,
      default: "",
      trim: true,
    },

    website: {
      type: String,
      default: "",
      trim: true,
    },

    achievements: {
      type: String,
      default: "",
      trim: true,
    },

    status: {
      type: String,
      enum: ["प्रकाशित", "ड्राफ्ट"],
      default: "प्रकाशित",
    },
  },
  {
    timestamps: true,
  },
);

const Leader = mongoose.model("Leader", leaderSchema);

export default Leader;
