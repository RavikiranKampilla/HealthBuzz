const express = require('express');
const router = express.Router();
const Medicine = require('../models/Medicine');

// Get all medicines for a student
router.get('/:studentId', async (req, res) => {
  try {
    const medicines = await Medicine.find({ studentId: req.params.studentId });
    res.json(medicines);
  } catch (error) {
    console.error('Error fetching medicines:', error);
    res.status(500).json({ message: 'Error fetching medicines' });
  }
});

// Add a new medicine
router.post('/', async (req, res) => {
  try {
    const medicine = new Medicine(req.body);
    const savedMedicine = await medicine.save();
    res.status(201).json(savedMedicine);
  } catch (error) {
    console.error('Error adding medicine:', error);
    res.status(400).json({ message: 'Error adding medicine' });
  }
});

// Update medicine taken status
router.put('/:id', async (req, res) => {
  try {
    const { taken } = req.body;
    const medicine = await Medicine.findByIdAndUpdate(
      req.params.id,
      { taken },
      { new: true }
    );
    
    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }
    
    res.json(medicine);
  } catch (error) {
    console.error('Error updating medicine status:', error);
    res.status(500).json({ message: 'Error updating medicine status' });
  }
});

module.exports = router;