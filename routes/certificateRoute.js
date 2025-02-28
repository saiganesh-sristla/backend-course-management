import express from "express";
import fs from "fs"
import Certificate from "../models/Certificate.js";
import Enrollment from "../models/Enrollment.js";
import { protect } from "../middleware/authMiddleware.js";
import generateCertificate from "../utils/generateCertificate.js";

const router = express.Router();

// ✅ Generate Certificate
router.get("/generate/:courseId/:studentId", async (req, res) => {
  try {
    const { courseId, studentId } = req.params;

    // Check if student is enrolled
    const enrollment = await Enrollment.findOne({ student: studentId, course: courseId }).populate("student").populate("course");
    if (!enrollment) return res.status(404).json({ message: "Not enrolled in this course" });

    // Check if certificate already exists
    let certificate = await Certificate.findOne({ student: studentId, course: courseId });

    // If certificate exists, delete the old file
    if (certificate) {
      if (fs.existsSync(certificate.certificateUrl)) {
        fs.unlinkSync(certificate.certificateUrl);
      }
    }

    // Generate new certificate
    console.log(enrollment)
    const certificateUrl = await generateCertificate(enrollment);

    if (certificate) {
      // Update existing certificate record
      certificate.certificateUrl = certificateUrl;
      await certificate.save();
    } else {
      // Save new certificate record
      certificate = new Certificate({
        student: studentId,
        course: courseId,
        certificateUrl,
      });
      await certificate.save();
    }

    res.json({ message: "Certificate generated successfully", certificate });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Error generating certificate", error });
  }
});


// ✅ Download Certificate
router.get("/download/:courseId/:studentId", async (req, res) => {
  try {
    const { courseId, studentId } = req.params;

    // Check if certificate exists
    const certificate = await Certificate.findOne({ student: studentId, course: courseId });
    if (!certificate) return res.status(404).json({ message: "Certificate not found" });

    res.download(certificate.certificateUrl);
  } catch (error) {
    res.status(500).json({ message: "Error downloading certificate", error });
  }
});

router.get("/download/:courseId",protect, async (req, res) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user.id
    // Check if certificate exists
    const certificate = await Certificate.findOne({ student: studentId, course: courseId });
    if (!certificate) return res.status(404).json({ message: "Certificate not found" });

    res.download(certificate.certificateUrl);
  } catch (error) {
    res.status(500).json({ message: "Error downloading certificate", error });
  }
});

export default router;
