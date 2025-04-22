const API_BASE_URL = 'http://localhost:3001/api';

// Fetch all medicines for a user
export const fetchMedicines = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/medicines/${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch medicines');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching medicines:', error);
    throw error;
  }
};

// Add a new medicine
export const addMedicine = async (medicine) => {
  try {
    // Validate required fields
    if (!medicine.userId || !medicine.name || !medicine.time || !medicine.description) {
      throw new Error('Missing required fields');
    }

    const response = await fetch(`${API_BASE_URL}/medicines`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        studentId: medicine.userId,
        name: medicine.name,
        dosage: medicine.description,
        frequency: medicine.time,
        startDate: new Date(),
        endDate: new Date(new Date().setDate(new Date().getDate() + 30)), // Default to 30 days
        notes: medicine.note || ''
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to add medicine');
    }

    const data = await response.json();
    return {
      id: data._id,
      user_id: data.studentId,
      name: data.name,
      time: data.frequency,
      description: data.dosage,
      note: data.notes,
      taken: false,
      created_at: data.createdAt
    };
  } catch (error) {
    console.error('Error adding medicine:', error);
    throw error;
  }
};

// Update medicine taken status
export const updateMedicineTaken = async (medicineId, taken) => {
  try {
    const response = await fetch(`${API_BASE_URL}/medicines/${medicineId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ taken })
    });

    if (!response.ok) {
      throw new Error('Failed to update medicine status');
    }

    const data = await response.json();
    return {
      id: data._id,
      user_id: data.studentId,
      name: data.name,
      time: data.frequency,
      description: data.dosage,
      note: data.notes,
      taken: data.taken,
      created_at: data.createdAt
    };
  } catch (error) {
    console.error('Error updating medicine status:', error);
    throw error;
  }
};