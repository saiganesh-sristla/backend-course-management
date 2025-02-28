import mongoose from "mongoose";

const CertificateSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    certificateUrl: { type: String, required: true }, // URL of the certificate file
  },
  { timestamps: true }
);

export default mongoose.model("Certificate", CertificateSchema);
