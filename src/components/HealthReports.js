import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchHealthReports } from "../services/api.js";
import { supabase } from "../services/supabase.js";

const HealthReports = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);

  const [selectedReport, setSelectedReport] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    weight: "",
    height: "",
    age: "",
    healthIssue: "",
    description: ""
  });

  const calculateBMI = (weight, height) => {
    const heightInMeters = height / 100;
    return (weight / (heightInMeters * heightInMeters)).toFixed(1);
  };

  useEffect(() => {
    const getReports = async () => {
      try {
        const { data: { user }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError || !user) {
          setError("User not authenticated");
          navigate('/');
          return;
        }

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('id, full_name')
          .eq('id', user.id)
          .single();

        if (profileError) {
          throw new Error('Failed to fetch user profile');
        }

        const userInfo = {
          id: profile.id,
          name: profile.full_name
        };

        setUserData(userInfo);
        const data = await fetchHealthReports(userInfo.id);
        setReports(data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch health reports");
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    getReports();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const bmi = calculateBMI(parseFloat(formData.weight), parseFloat(formData.height));
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('studentId', userData.id);
      formDataToSend.append('studentName', userData.name);
      formDataToSend.append('reportData', JSON.stringify({
        weight: parseFloat(formData.weight),
        height: parseFloat(formData.height),
        age: parseInt(formData.age),
        bmi: bmi,
        healthIssue: formData.healthIssue,
        description: formData.description,
        date: new Date().toISOString()
      }));

      // Add PDF file if selected
      if (formData.pdfFile) {
        formDataToSend.append('pdfFile', formData.pdfFile);
      }

      const response = await fetch('http://localhost:3001/api/reports', {
        method: 'POST',
        body: formDataToSend
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add report');
      }

      // Refresh the reports list
      const data = await fetchHealthReports(userData.id);
      setReports(data);
      setShowForm(false);
      setFormData({
        weight: "",
        height: "",
        age: "",
        healthIssue: "",
        description: "",
        pdfFile: null
      });
    } catch (err) {
      console.error("Error adding report:", err);
      alert(`Failed to add health report: ${err.message}`);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Your Health Reports</h1>
        {userData && (
          <div className="text-gray-600">
            <p><strong>{userData.id} - {userData.name}</strong></p>
          </div>
        )}
      </div>

      <button
        onClick={() => setShowForm(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg mb-4"
      >
        Add New Report
      </button>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Add New Health Report</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Weight (kg)</label>
                <input
                  type="number"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Height (cm)</label>
                <input
                  type="number"
                  value={formData.height}
                  onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Age</label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Health Issue</label>
                <input
                  type="text"
                  value={formData.healthIssue}
                  onChange={(e) => setFormData({ ...formData, healthIssue: e.target.value })}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Description (Optional)</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2 border rounded"
                  rows="3"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">PDF Report (Optional)</label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setFormData({ ...formData, pdfFile: e.target.files[0] })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="mt-6">
        {reports.length === 0 ? (
          <p>No health reports found.</p>
        ) : (
          reports.map((report, index) => {
            const reportData = JSON.parse(report.reportData);
            return (
              <div 
                key={index} 
                className="border p-4 rounded-lg mb-3 shadow-sm hover:bg-gray-50"
              >
                <p className="text-gray-700"><strong>Date:</strong> {new Date(reportData.date).toLocaleDateString()}</p>
                <p className="text-gray-700"><strong>BMI:</strong> {reportData.bmi}</p>
                <p className="text-gray-700"><strong>Health Issue:</strong> {reportData.healthIssue}</p>
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => setSelectedReport(report)}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    View Details
                  </button>
                  {report.pdfFileId && (
                    <button
                      onClick={async () => {
                        try {
                          const response = await fetch(`http://localhost:3001/api/reports/${report._id}/pdf`);
                          if (!response.ok) {
                            throw new Error('Failed to fetch PDF');
                          }
                          const blob = await response.blob();
                          const url = window.URL.createObjectURL(blob);
                          window.open(url, '_blank');
                        } catch (error) {
                          console.error('Error viewing PDF:', error);
                          alert('Failed to view PDF. Please try again.');
                        }
                      }}
                      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      View Report PDF
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Report Details</h2>
            {(() => {
              const data = JSON.parse(selectedReport.reportData);
              return (
                <div>
                  <p className="mb-2"><strong>Date:</strong> {new Date(data.date).toLocaleDateString()}</p>
                  <p className="mb-2"><strong>Weight:</strong> {data.weight} kg</p>
                  <p className="mb-2"><strong>Height:</strong> {data.height} cm</p>
                  <p className="mb-2"><strong>Age:</strong> {data.age} years</p>
                  <p className="mb-2"><strong>BMI:</strong> {data.bmi}</p>
                  <p className="mb-2"><strong>Health Issue:</strong> {data.healthIssue}</p>
                  {data.description && (
                    <p className="mb-2"><strong>Description:</strong> {data.description}</p>
                  )}
                </div>
              );
            })()} 
            <button
              onClick={() => setSelectedReport(null)}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <button onClick={() => navigate(-1)} className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-4">
        Back
      </button>
    </div>
  );
};

export default HealthReports;
