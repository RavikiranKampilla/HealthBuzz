const mongoose = require('mongoose');
const LeaveRequest = require('../models/LeaveRequest');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const createTestLeaveRequest = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const testLeaveRequest = new LeaveRequest({
      studentId: 'TEST001',
      studentName: 'Test Student',
      title: 'Medical Leave',
      date: '2024-01-20 - 2024-01-25',
      status: 'Pending',
      type: 'pending'
    });

    await testLeaveRequest.save();
    console.log('Test leave request created successfully');

  } catch (error) {
    console.error('Error creating test leave request:', error);
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
};

createTestLeaveRequest();