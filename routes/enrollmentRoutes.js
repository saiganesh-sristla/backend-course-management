import express from "express";
import Enrollment from "../models/Enrollment.js";
import Course from "../models/Course.js";
import { protect } from "../middleware/authMiddleware.js";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// ✅ Enroll in a Course (Without Payment for Now)
router.post("/enroll", protect, async (req, res) => {
  try {
    const { courseId } = req.body;
    const course = await Course.findById(courseId);

    if (!course) return res.status(404).json({ message: "Course not found" });

    // ✅ Check if Student is Already Enrolled
    const existingEnrollment = await Enrollment.findOne({
      student: req.user.id,
      course: courseId,
    });

    if (existingEnrollment) {
      return res.status(400).json({ message: "You are already enrolled in this course" });
    }

    // ✅ Save Enrollment (Without Payment)
    const enrollment = new Enrollment({
      student: req.user.id,
      course: courseId,
      paymentStatus: "pending", // Change to "completed" later when payment is integrated
      receiptUrl: null, // No actual payment for now
    });

    await enrollment.save();

    res.status(201).json({ message: "Enrollment successful", enrollment });
  } catch (error) {
    res.status(500).json({ message: "Error enrolling in course", error });
  }
});

// ✅ Get Student's Enrolled Courses
router.get("/my-courses", protect, async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user.id }).populate("course");
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching enrollments", error });
  }
});

router.get("/all-enrollments", async (req, res) => {
  try {
    const enrollments = await Enrollment.find().populate("course");
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching enrollments", error });
  }
});

// ✅ Get Payment Receipt (Commented Out Since No Payment)
router.get("/receipt/:enrollmentId", protect, async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.enrollmentId);
    if (!enrollment) return res.status(404).json({ message: "Enrollment not found" });

    res.json({ receiptUrl: enrollment.receiptUrl });
  } catch (error) {
    res.status(500).json({ message: "Error fetching receipt", error });
  }
});

export default router;
