import mongoose from "mongoose";

const EnrollmentSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    paymentStatus: { type: String, enum: ["pending", "completed"], default: "pending" },
    receiptUrl: { type: String }, // Payment proof
  },
  { timestamps: true }
);

export default mongoose.model("Enrollment", EnrollmentSchema);
