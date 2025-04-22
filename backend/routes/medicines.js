const express = require('express');
const router = express.Router();
const Medicine = require('../models/Medicine');

// Get all medicines for a student
router.get('/:studentId', async (req, res) => {
  try {
    const medicines = await Medicine.find({ studentId: req.params.studentId });
    res.json(medicines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a new medicine
router.post('/', async (req, res) => {
  const medicine = new Medicine({
    studentId: req.body.studentId,
    name: req.body.name,
    dosage: req.body.dosage,
    frequency: req.body.frequency,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    notes: req.body.notes,
    taken: false
  });

  try {
    const newMedicine = await medicine.save();
    res.status(201).json(newMedicine);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a medicine
router.put('/:id', async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    // Only update the taken status if it's provided
    if (req.body.taken !== undefined) {
      medicine.taken = req.body.taken;
    } else {
      Object.assign(medicine, req.body);
    }

    const updatedMedicine = await medicine.save();
    res.json(updatedMedicine);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a medicine
router.delete('/:id', async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    await medicine.deleteOne();
    res.json({ message: 'Medicine deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;