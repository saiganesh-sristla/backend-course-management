import express from "express";
import Attendance from "../models/Attendance.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Mark Attendance
router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const { student, course, percent } = req.body;

    if (!student || !course || !percent) {
      return res.status(400).json({ message: "All fields are required" });
    }

    let attendance = await Attendance.findOne({ student, course });

    if (attendance) {
      // Update existing record
      attendance.percent = percent;
      await attendance.save();
      return res.status(200).json({ message: "Attendance updated", attendance });
    }

    // Create new attendance record
    attendance = new Attendance({ student, course, percent });
    await attendance.save();
    res.status(201).json({ message: "Attendance recorded", attendance });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// Get attendance for a specific student and course (Public)
router.get("/:studentId/:courseId", async (req, res) => {
  try {
    const { studentId, courseId } = req.params;

    const attendance = await Attendance.findOne({ student: studentId, course: courseId });

    if (!attendance) {
      return res.status(404).json({ message: "Attendance not found" });
    }

    res.status(200).json({ attendance });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

router.get("/:courseId",protect, async (req, res) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user.id;
    console.log(studentId)
    const attendance = await Attendance.findOne({ student:studentId, course: courseId });

    if (!attendance) {
      return res.status(404).json({ message: "Attendance not found" });
    }

    res.status(200).json({ attendance });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

export default router;