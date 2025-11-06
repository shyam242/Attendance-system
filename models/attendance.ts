import mongoose, { Schema, model, models } from "mongoose";

const AttendanceSchema = new Schema(
  {
    company: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    rollNumber: {
      type: String,
      required: true,
      trim: true, // ✅ new field
    },
    branch: {
      type: String,
      required: true,
      trim: true, // ✅ new field
    },
    photo: {
      type: String, // base64 or URL (from camera capture)
      required: true,
    },
    ip_address: {
      type: String,
      default: "unknown",
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

// Prevent model overwrite issues in Next.js hot reload
const Attendance = models.Attendance || model("Attendance", AttendanceSchema);

export default Attendance;
