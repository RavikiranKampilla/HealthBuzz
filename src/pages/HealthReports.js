import React, { useState, useEffect } from 'react';
import { fetchHealthReports } from '../services/api';

const HealthReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadReports = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchHealthReports();
        setReports(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Health Reports</h1>
      {reports.length === 0 ? (
        <p className="text-gray-600">No health reports found.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {reports.map((report) => (
            <div key={report._id} className="bg-white p-4 rounded-lg shadow">
              <h2 className="font-semibold text-lg">{report.studentName}</h2>
              <p className="text-gray-600 text-sm mb-2">
                Date: {new Date(report.date).toLocaleDateString()}
              </p>
              <div className="text-sm">
                {JSON.parse(report.reportData).map((item, index) => (
                  <div key={index} className="mb-2">
                    <p><strong>{item.question}:</strong> {item.answer}</p>
                  </div>
                ))}
              </div>
              {report.pdfFileId && (
                <a
                  href={`${process.env.REACT_APP_API_URL}/api/health-reports/${report._id}/pdf`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-blue-600 hover:text-blue-800"
                >
                  View PDF Report
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HealthReports;