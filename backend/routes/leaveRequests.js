const express = require('express');
const router = express.Router();
const LeaveRequest = require('../models/LeaveRequest');

// Get all leave requests (for faculty)
router.get('/all', async (req, res) => {
  try {
    const leaveRequests = await LeaveRequest.find();
    res.json(leaveRequests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all leave requests for a student
router.get('/:studentId', async (req, res) => {
  try {
    const leaveRequests = await LeaveRequest.find();
    res.json(leaveRequests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new leave request
router.post('/', async (req, res) => {
  try {
    // Validate required fields
    const { studentId, studentName, title, date } = req.body;
    if (!studentId || !studentName || !title || !date) {
      return res.status(400).json({ message: 'All fields are required: studentId, studentName, title, date' });
    }

    const leaveRequest = new LeaveRequest({
      studentId,
      studentName,
      title,
      date,
      status: 'Pending',
      type: 'pending'
    });

    const newLeaveRequest = await leaveRequest.save();
    res.status(201).json(newLeaveRequest);
  } catch (error) {
    console.error('Error creating leave request:', error);
    res.status(500).json({ message: 'Failed to create leave request. Please try again.' });
  }
});

// Update leave request status
router.patch('/:id', async (req, res) => {
  try {
    const leaveRequest = await LeaveRequest.findById(req.params.id);
    if (!leaveRequest) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    if (req.body.status) {
      leaveRequest.status = req.body.status;
      leaveRequest.type = req.body.status.toLowerCase();
    }

    const updatedLeaveRequest = await leaveRequest.save();
    res.json(updatedLeaveRequest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;