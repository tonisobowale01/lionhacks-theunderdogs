const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const fs = require("fs");
const pdfParse = require("pdf-parse");

// POST /api/syllabus/process
router.post("/process", upload.single("file"), async (req, res) => {
  const filePath = req.file?.path;
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    let extractedText = "";

    if (req.file.mimetype === "application/pdf") {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParse(dataBuffer);
      extractedText = data.text;
    } else {
      // Assume plain text
      extractedText = fs.readFileSync(filePath, "utf8");
    }

    const extractedTitle = req.file.originalname.replace(/\.[^/.]+$/, "");

    res.json({ extractedTitle, extractedText });
  } catch (error) {
    res.status(500).json({ message: error.message });
  } finally {
    // Clean up: always delete the file from uploads after processing attempt
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
});

module.exports = router;
