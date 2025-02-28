import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    duration: { type: String, required: true }, // Example: "4 weeks"
    price: { type: Number, required: true }, // Course Fee
  },
  { timestamps: true }
);

export default mongoose.model("Course", CourseSchema);
