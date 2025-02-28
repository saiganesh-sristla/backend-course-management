const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");

const generateCertificate = (enrollment) => {
  return new Promise((resolve, reject) => {
    const certificatesDir = path.join("public", "certificates");

    // Ensure the directory exists
    if (!fs.existsSync(certificatesDir)) {
      fs.mkdirSync(certificatesDir, { recursive: true });
    }

    const fileName = `${enrollment.student.name.replace(/\s+/g, "_")}_${enrollment.course.title.replace(/\s+/g, "_")}_Certificate.pdf`;
    const filePath = path.join(certificatesDir, fileName);

    // Create PDF with better dimensions for a certificate
    const doc = new PDFDocument({
      size: [800, 600],
      margins: {
        top: 50,
        bottom: 50,
        left: 50,
        right: 50
      }
    });
    
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // Add a border to the certificate
    doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40)
       .lineWidth(3)
       .stroke("#1a237e");

    // Add inner decorative border
    doc.rect(35, 35, doc.page.width - 70, doc.page.height - 70)
       .lineWidth(1)
       .dash(5, { space: 10 })
       .stroke("#3f51b5");
    doc.undash();

    // Add certificate header
    doc.font('Helvetica-Bold')
       .fontSize(28)
       .fillColor("#1a237e")
       .text("CERTIFICATE OF COMPLETION", { align: "center" })
       .moveDown(0.5);

    // Add decorative line
    const lineY = doc.y;
    doc.moveTo(150, lineY)
       .lineTo(doc.page.width - 150, lineY)
       .lineWidth(2)
       .stroke("#5c6bc0");
    doc.moveDown();

    // Add institution name (assuming it's part of the application)
    doc.font('Helvetica-Bold')
       .fontSize(18)
       .fillColor("#283593")
       .text("Mulund College of Commerce", { align: "center" })
       .moveDown(1.5);

    // Add student name
    doc.font('Helvetica')
       .fontSize(16)
       .fillColor("#000")
       .text("This is to certify that", { align: "center" })
       .moveDown(0.5);

    doc.font('Helvetica-Bold')
       .fontSize(24)
       .fillColor("#1a237e")
       .text(enrollment.student.name, { align: "center" })
       .moveDown(0.5);

    // Add course completion text
    doc.font('Helvetica')
       .fontSize(16)
       .fillColor("#000")
       .text("has successfully completed the course:", { align: "center" })
       .moveDown(0.5);

    doc.font('Helvetica-BoldOblique')
       .fontSize(22)
       .fillColor("#1a237e")
       .text(enrollment.course.title, { align: "center" })
       .moveDown(0.5);

    // Add course details
    doc.font('Helvetica')
       .fontSize(14)
       .fillColor("#000")
       .text(`Duration: ${enrollment.course.duration}`, { align: "center" })
       .moveDown(0.5);

    doc.font('Helvetica')
       .fontSize(14)
       .text(`Course Description: ${enrollment.course.description.substring(0, 100)}...`, { align: "center" })
       .moveDown(1.5);

    // Add date
    const issueDate = new Date(enrollment.updatedAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    doc.fontSize(14)
       .text(`Issued on: ${issueDate}`, { align: "center" })
       .moveDown(1.5);

    // Add signature lines
    const signatureY = doc.y + 30;
    
    // First signature (left)
    doc.moveTo(100, signatureY)
       .lineTo(300, signatureY)
       .lineWidth(1)
       .stroke();
    doc.fontSize(12)
       .text("Course Instructor", 150, signatureY + 10);

    // Second signature (right)
    doc.moveTo(500, signatureY)
       .lineTo(700, signatureY)
       .stroke();
    doc.fontSize(12)
       .text("Program Director", 550, signatureY + 10);

    // Add certificate ID
    doc.fontSize(10)
       .fillColor("#666")
       .text(`Certificate ID: ${enrollment._id.toString()}`, { align: "center" })
       .moveDown(0.5);

    // Add verification text
    doc.fontSize(8)
       .fillColor("#999")
       .text("This certificate can be verified online at www.educationalexcellence.com/verify", { align: "center" });

    doc.end();

    stream.on("finish", () => resolve(filePath));
    stream.on("error", (err) => reject(err));
  });
};

module.exports = generateCertificate;