// backend/models/HealthReport.js
const mongoose = require('mongoose');
const { GridFSBucket } = require('mongodb');

const healthReportSchema = new mongoose.Schema({
  studentId: { type: String, required: true },
  studentName: { type: String, required: true },
  reportData: { type: String, required: true },
  date: { type: Date, default: Date.now },
  pdfFileId: { type: mongoose.Schema.Types.ObjectId },
  pdfFileName: { type: String }
});

// Create GridFS bucket for PDF storage
let bucket;
healthReportSchema.statics.initBucket = function(db) {
  bucket = new GridFSBucket(db, {
    bucketName: 'healthReportPDFs'
  });
};

// Method to store PDF file
healthReportSchema.methods.storePDF = async function(fileBuffer, filename) {
  if (!bucket) throw new Error('GridFS bucket not initialized');
  
  // Delete existing PDF if any
  if (this.pdfFileId) {
    try {
      await bucket.delete(this.pdfFileId);
    } catch (err) {
      console.error('Error deleting existing PDF:', err);
    }
  }

  // Upload new PDF
  const uploadStream = bucket.openUploadStream(filename);
  await new Promise((resolve, reject) => {
    uploadStream.end(fileBuffer, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });

  this.pdfFileId = uploadStream.id;
  this.pdfFileName = filename;
  await this.save();
};

// Method to retrieve PDF file
healthReportSchema.methods.getPDF = async function() {
  if (!bucket || !this.pdfFileId) return null;

  const chunks = [];
  const downloadStream = bucket.openDownloadStream(this.pdfFileId);

  return new Promise((resolve, reject) => {
    downloadStream.on('data', chunk => chunks.push(chunk));
    downloadStream.on('error', reject);
    downloadStream.on('end', () => resolve(Buffer.concat(chunks)));
  });
};

const HealthReport = mongoose.model('HealthReport', healthReportSchema);

module.exports = HealthReport;
