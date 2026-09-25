import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    date: {
      type: String,
      required: true,
    },

    time: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      default: "",
      trim: true,
    },

    imageUrl: {
      type: String,
      default: "",
    },

    zoomLink: {
      type: String,
      default: "",
      trim: true,
    },

    zoomMeetingId: {
      type: String,
      default: "",
      trim: true,
    },

    zoomPassword: {
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
  }
);

const Event = mongoose.model("Event", eventSchema);

export default Event;