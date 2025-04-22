// backend/routes/healthReports.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const HealthReport = require('../models/HealthReport');

// POST: Add a new health report
router.post('/', upload.single('pdfFile'), async (req, res) => {
  try {
    const { studentId, studentName, reportData } = req.body;

    // Validation check
    if (!studentId || !studentName || !reportData) {
      return res.status(400).json({ message: "studentId, studentName, and reportData are required" });
    }

    // Ensure reportData is properly parsed if it's a string
    let parsedReportData = reportData;
    try {
      if (typeof reportData === 'string') {
        parsedReportData = JSON.parse(reportData);
      }
    } catch (parseErr) {
      console.error("Error parsing reportData:", parseErr);
      return res.status(400).json({ message: "Invalid report data format" });
    }

    const newReport = new HealthReport({ studentId, studentName, reportData: JSON.stringify(parsedReportData) });
    await newReport.save();

    // Handle PDF file if provided
    if (req.file) {
      await newReport.storePDF(req.file.buffer, req.file.originalname);
    }
    
    res.status(201).json({ message: 'Report added successfully' });
  } catch (err) {
    console.error("Error adding report:", err);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

// GET: Get all students with health reports
router.get('/students', async (req, res) => {
  try {
    const reports = await HealthReport.find({}, 'studentId studentName reportData date pdfFileId').lean();
    res.json(reports);
  } catch (err) {
    console.error('Error fetching students:', err);
    res.status(500).json({ message: 'Server error while fetching students' });
  }
});

// GET: Get all health reports for a student
router.get('/student/:studentId', async (req, res) => {
  try {
    const reports = await HealthReport.find({ studentId: req.params.studentId });
    
    if (reports.length === 0) {
      return res.status(404).json({ message: "No reports found for this student." });
    }

    res.json(reports);
  } catch (err) {
    console.error("Error fetching reports:", err);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

// GET: Get a specific report by ID
router.get('/:reportId', async (req, res) => {
  try {
    const report = await HealthReport.findById(req.params.reportId);
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }
    res.json({
      _id: report._id,
      studentId: report.studentId,
      studentName: report.studentName,
      reportData: report.reportData,
      date: report.date,
      pdfFileId: report.pdfFileId
    });
  } catch (err) {
    console.error("Error fetching report:", err);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

// GET: Get PDF for a specific report
router.get('/:reportId/pdf', async (req, res) => {
  try {
    const report = await HealthReport.findById(req.params.reportId);
    if (!report || !report.pdfFileId) {
      return res.status(404).json({ message: 'PDF not found for this report' });
    }

    const pdfStream = await report.getPDF();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${report.pdfFileName}"`);
    
    pdfStream.pipe(res);
    
    pdfStream.on('error', (error) => {
      console.error('Error streaming PDF:', error);
      if (!res.headersSent) {
        res.status(500).json({ message: 'Error streaming PDF file' });
      }
    });
  } catch (err) {
    console.error('Error retrieving PDF:', err);
    res.status(500).json({ message: 'Failed to retrieve PDF file' });
  }
});

module.exports = router;
