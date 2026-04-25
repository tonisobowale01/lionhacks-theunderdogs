const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

// POST /api/syllabus/process
router.post("/process", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    // In a real app, you'd parse the PDF text here.
    // For now, we return the filename as the "extractedTitle" as expected by the frontend.
    const extractedTitle = req.file.originalname.replace(/\.[^/.]+$/, "");
    res.json({ extractedTitle });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
