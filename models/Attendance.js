import mongoose from "mongoose";

const AttendanceSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    percent: { type: String }, // Stores attendance records
  },
  { timestamps: true }
);

export default mongoose.model("Attendance", AttendanceSchema);
