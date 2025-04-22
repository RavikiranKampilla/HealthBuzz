// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const notificationService = require('./services/notificationService');
const HealthReport = require('./models/HealthReport');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json()); // Parse incoming JSON data

// Check if .env variables are loaded
if (!process.env.MONGO_URI) {
  console.error("❌ Error: MONGO_URI is not defined in .env file.");
  process.exit(1);
}

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB database connection established successfully');
    // Initialize GridFS bucket after successful connection
    const db = mongoose.connection.db;
    HealthReport.initBucket(db);
    console.log('✅ GridFS bucket initialized for PDF storage');
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1); // Exit if MongoDB connection fails
  });

// Routes
const healthReportRoutes = require('./routes/healthReports');
const medicineRoutes = require('./routes/medicines');
const leaveRequestRoutes = require('./routes/leaveRequests');

app.use('/api/health-reports', healthReportRoutes);
app.use('/api/medicines', medicineRoutes);
app.use('/api/leave-requests', leaveRequestRoutes);

// Health check endpoint
app.get('/api/health-reports/health-check', (req, res) => {
  res.status(200).json({ status: 'ok', message: '✅ Health check passed' });
});

// Simple route to test the server
app.get('/', (req, res) => {
  res.send('✅ Backend is running');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ message: err.message || 'Internal server error' });
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
  notificationService.start(); // Start the notification service
});

// Graceful shutdown
process.on('SIGINT', async () => {
  notificationService.stop(); // Stop the notification service
  await mongoose.connection.close();
  console.log("🛑 MongoDB connection closed.");
  process.exit(0);
});
