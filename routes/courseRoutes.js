import express from "express";
import Course from "../models/Course.js";
import User from "../models/User.js";
import Enrollment from "../models/Enrollment.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Add a New Course (Admin Only)
router.post("/add", protect, adminOnly, async (req, res) => {
  try {
    const { title, description, duration, price } = req.body;

    const course = new Course({ title, description, duration, price });
    await course.save();

    res.status(201).json({ message: "Course added successfully", course });
  } catch (error) {
    res.status(500).json({ message: "Error adding course", error });
  }
});

// ✅ Update Course Details (Admin Only)
router.put("/update/:id", protect, adminOnly, async (req, res) => {
  try {
    const { title, description, duration, price } = req.body;
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { title, description, duration, price },
      { new: true }
    );

    if (!course) return res.status(404).json({ message: "Course not found" });

    res.json({ message: "Course updated successfully", course });
  } catch (error) {
    res.status(500).json({ message: "Error updating course", error });
  }
});

// ✅ Delete a Course (Admin Only)
router.delete("/delete/:id", protect, adminOnly, async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);

    if (!course) return res.status(404).json({ message: "Course not found" });
    await Enrollment.deleteMany({course: req.params.id});
    res.json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting course", error });
  }
});

router.delete("/delete/student/:id", protect, adminOnly, async (req, res) => {
  try {
    const student = await User.findByIdAndDelete(req.params.id);

    if (!student) return res.status(404).json({ message: "student not found" });
    await Enrollment.deleteMany({student: req.params.id});
    res.json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting course", error });
  }
});

// ✅ Get All Courses (Public)
router.get("/all", async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: "Error fetching courses", error });
  }
});

router.get("/all-students",protect, adminOnly, async (req, res) => {
  try {
    const students = await User.find({role:"student"});
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: "Error fetching courses", error });
  }
});

router.get("/available", protect, async (req, res) => {
  try {
    const studentId = req.user.id;
    const enrolledCourses = await Enrollment.find({ student: studentId }).select("course");
    const enrolledCourseIds = enrolledCourses.map((enrollment) => enrollment.course);

    const availableCourses = await Course.find({ _id: { $nin: enrolledCourseIds } });
    res.status(200).json(availableCourses);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Error fetching available courses", error });
  }
});

// ✅ Get Single Course Details
router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) return res.status(404).json({ message: "Course not found" });

    res.json(course);
  } catch (error) {
    res.status(500).json({ message: "Error fetching course details", error });
  }
});

router.get("/student/:id", async (req, res) => {
  try {
    const student = await User.findById(req.params.id);

    if (!student) return res.status(404).json({ message: "student not found" });

    res.json(student);
  } catch (error) {
    res.status(500).json({ message: "Error fetching course details", error });
  }
});

export default router;