import React, { useState, useEffect } from 'react';
import { fetchHealthReports } from '../services/api';

const Report = () => {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const loadReports = async () => {
      try {
        setLoading(true);
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user.studentId) {
          throw new Error('User not found');
        }
        const data = await fetchHealthReports(user.studentId);
        setReports(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, []);

  const handleReportClick = (report) => {
    setSelectedReport(report);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedReport(null);
    setShowModal(false);
  };

  if (loading) return <div className="text-center p-4">Loading reports...</div>;
  if (error) return <div className="text-red-500 p-4">{error}</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Health Reports</h2>
      {reports.length === 0 ? (
        <p>No reports found.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {reports.map((report) => (
            <div
              key={report._id}
              className="p-4 border rounded-lg shadow hover:shadow-md cursor-pointer transition-shadow"
              onClick={() => handleReportClick(report)}
            >
              <h3 className="font-semibold">{report.title}</h3>
              <p className="text-sm text-gray-600">{new Date(report.date).toLocaleDateString()}</p>
              <p className="text-sm mt-2">{report.description}</p>
            </div>
          ))}
        </div>
      )}

      {showModal && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold">{selectedReport.title}</h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-gray-600">Date: {new Date(selectedReport.date).toLocaleDateString()}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Health Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600">Height: {selectedReport.height} cm</p>
                    <p className="text-gray-600">Weight: {selectedReport.weight} kg</p>
                    <p className="text-gray-600">BMI: {selectedReport.bmi}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Blood Pressure: {selectedReport.bloodPressure}</p>
                    <p className="text-gray-600">Blood Sugar: {selectedReport.bloodSugar}</p>
                  </div>
                </div>
              </div>
              {selectedReport.healthConditions && (
                <div>
                  <h3 className="font-semibold mb-2">Health Conditions</h3>
                  <p className="text-gray-600">{selectedReport.healthConditions}</p>
                </div>
              )}
              {selectedReport.medications && (
                <div>
                  <h3 className="font-semibold mb-2">Medications</h3>
                  <p className="text-gray-600">{selectedReport.medications}</p>
                </div>
              )}
              {selectedReport.notes && (
                <div>
                  <h3 className="font-semibold mb-2">Additional Notes</h3>
                  <p className="text-gray-600">{selectedReport.notes}</p>
                </div>
              )}
              {selectedReport.pdfFileId && (
                <div className="mt-4">
                  <button
                    onClick={() => window.open(`http://localhost:3001/api/reports/${selectedReport._id}/pdf`, '_blank')}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    View PDF Report
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Report;