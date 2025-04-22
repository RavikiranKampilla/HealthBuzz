import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchMedicines, addMedicine, updateMedicineTaken } from "../services/medicineService.js";

const Medicines = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [newMedicine, setNewMedicine] = useState({
    time: "",
    name: "",
    description: "",
    note: "",
  });

  // Get user data from localStorage
  const userData = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const loadMedicines = async () => {
      try {
        const data = await fetchMedicines(userData.id);
        const mappedMedicines = data.map(med => ({
          _id: med._id,
          name: med.name,
          time: med.frequency,
          description: med.dosage,
          note: med.notes,
          taken: med.taken
        }));
        setMedicines(mappedMedicines);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userData?.id) {
      loadMedicines();
    }
  }, [userData?.id]);

  const toggleTaken = async (id) => {
    try {
      const medicine = medicines.find(med => med._id === id);
      if (!medicine) {
        throw new Error('Medicine not found');
      }

      // Update the state optimistically
      setMedicines(prev =>
        prev.map(med => med._id === id ? { ...med, taken: !med.taken } : med)
      );

      // Make the API call
      const updatedMedicine = await updateMedicineTaken(id, !medicine.taken);
      
      if (!updatedMedicine) {
        // Revert the state if API call fails
        setMedicines(prev =>
          prev.map(med => med._id === id ? { ...med, taken: medicine.taken } : med)
        );
        throw new Error('Failed to update medicine status');
      }
    } catch (err) {
      console.error('Error updating medicine status:', err);
      alert('Failed to update medicine status');
      // Revert the state on error
      const medicine = medicines.find(med => med._id === id);
      if (medicine) {
        setMedicines(prev =>
          prev.map(med => med._id === id ? { ...med, taken: medicine.taken } : med)
        );
      }
    }
  };

  const handleAddMedicine = async (e) => {
    e.preventDefault();
    if (!newMedicine.time || !newMedicine.name || !newMedicine.description) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      if (!userData?.id) {
        alert("Please log in to add medicines.");
        return;
      }

      const medicineData = {
        userId: userData.id,
        ...newMedicine
      };
      const newMed = await addMedicine(medicineData);
      if (newMed) {
        setMedicines(prev => [...prev, newMed]);
        setShowForm(false);
        setNewMedicine({ time: "", name: "", description: "", note: "" });
      } else {
        throw new Error("Failed to create medicine record");
      }
    } catch (err) {
      console.error("Error adding medicine:", err);
      alert(err.message || "Failed to add medicine. Please try again.");
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">Error: {error}</div>;
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/5 bg-gray-100 p-5 flex flex-col">
        <h2 className="text-2xl font-bold text-blue-600 mb-5">HealthBuzz</h2>
        <nav className="space-y-4">
          <Link to="/dashboard" className="block py-3 px-4 bg-gray-200 rounded-lg hover:bg-blue-500 hover:text-white">
            🏠 Dashboard
          </Link>
          <Link to="/meal-plan" className="block py-3 px-4 bg-gray-200 rounded-lg hover:bg-blue-500 hover:text-white">
            🍽 Meal Plan
          </Link>
          <Link to="/medicines" className="block py-3 px-4 bg-blue-500 text-white rounded-lg">
            💊 Medicines
          </Link>
          <Link to="/leave-request" className="block py-3 px-4 bg-gray-200 rounded-lg hover:bg-blue-500 hover:text-white">
            📝 Leave
          </Link>
        </nav>
        <p className="mt-auto text-sm text-gray-500 italic">
          "Rest is not lazy, it's essential for your mental and physical recovery."
        </p>
      </div>

      {/* Main Content */}
      <div className="w-4/5 p-8 bg-gray-50">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">💊 Medicine Reminder</h1>
            <p className="text-gray-600">Track your medications and stay on schedule</p>
          </div>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600"
            onClick={() => setShowForm(true)}
          >
            + Add Medicine
          </button>
        </div>

        {/* Medicine Cards */}
        <div className="grid grid-cols-2 gap-6">
          {medicines.map((med) => (
            <div key={med._id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={med.taken}
                    onChange={() => toggleTaken(med._id)}
                    className="w-5 h-5 text-blue-600 cursor-pointer"
                  />
                  <div>
                    <h2 className="text-xl font-semibold text-blue-600">{med.name}</h2>
                    <span className="text-sm text-gray-500">Take at: {med.time}</span>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${med.taken ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                  {med.taken ? 'Taken' : 'Pending'}
                </span>
              </div>
              <div className={`space-y-2 ${med.taken ? 'opacity-50' : ''}}`}>
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-sm font-medium text-gray-700">Description:</p>
                  <p className="text-sm text-gray-600">{med.description}</p>
                </div>
                {med.note && (
                  <div className="bg-blue-50 p-3 rounded-md">
                    <p className="text-sm font-medium text-gray-700">Additional Notes:</p>
                    <p className="text-sm text-blue-600">{med.note}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Medicine Form (Modal) */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Add New Medicine</h2>
            <form onSubmit={handleAddMedicine}>
              <div className="mb-3">
                <label className="block text-gray-700">Time of Day</label>
                <select
                  value={newMedicine.time}
                  onChange={(e) => setNewMedicine({ ...newMedicine, time: e.target.value })}
                  className="w-full p-2 border rounded-md"
                  required
                >
                  <option value="">Select Time</option>
                  <option value="Morning">Morning</option>
                  <option value="Afternoon">Afternoon</option>
                  <option value="Evening">Evening</option>
                  <option value="Night">Night</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="block text-gray-700">Medicine Name</label>
                <input
                  type="text"
                  value={newMedicine.name}
                  onChange={(e) => setNewMedicine({ ...newMedicine, name: e.target.value })}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="block text-gray-700">Description</label>
                <input
                  type="text"
                  value={newMedicine.description}
                  onChange={(e) => setNewMedicine({ ...newMedicine, description: e.target.value })}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="block text-gray-700">Additional Notes</label>
                <input
                  type="text"
                  value={newMedicine.note}
                  onChange={(e) => setNewMedicine({ ...newMedicine, note: e.target.value })}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md mr-2"
                >
                  Cancel
                </button>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">
                  Add Medicine
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Medicines;
