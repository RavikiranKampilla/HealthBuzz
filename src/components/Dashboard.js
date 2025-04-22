import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import { fetchHealthReports, addHealthReport, fetchReportById } from "../services/api.js";

const calculateBMI = (weight, height) => {
  // Convert height from cm to meters
  const heightInMeters = height / 100;
  // Calculate BMI using the formula: weight / (height * height)
  const bmi = weight / (heightInMeters * heightInMeters);
  // Round to 1 decimal place
  return Math.round(bmi * 10) / 10;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [showReports, setShowReports] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [condition, setCondition] = useState("");
  const [description, setDescription] = useState("");
  const [healthReports, setHealthReports] = useState([]);
  const [user, setUser] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showReportDetails, setShowReportDetails] = useState(false);
  const [pdfFile, setPdfFile] = useState(null);

  // Fetch logged-in user details
  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Get user data from localStorage
        const userData = localStorage.getItem('user');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          if (parsedUser.studentId) {
            await loadHealthReports(parsedUser.studentId);
          }
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);

  // Fetch health reports
  const loadHealthReports = async (studentId) => {
    try {
      const reports = await fetchHealthReports(studentId);
      if (!Array.isArray(reports)) {
        console.error('Invalid reports data:', reports);
        setHealthReports([]);
        return;
      }
      // Filter out duplicate reports based on _id and date
      const uniqueReports = reports.reduce((acc, current) => {
        // Check if we already have a report with this ID
        const existingReport = acc.find(item => item._id === current._id);
        if (!existingReport) {
          return acc.concat([current]);
        }
        // If we have a report with this ID, keep the most recent one
        if (new Date(current.date) > new Date(existingReport.date)) {
          return acc.map(item => item._id === current._id ? current : item);
        }
        return acc;
      }, []);
      
      // Sort reports by date in descending order (newest first)
      const sortedReports = uniqueReports.sort((a, b) => 
        new Date(b.date) - new Date(a.date)
      );
      
      setHealthReports(sortedReports);
    } catch (error) {
      console.error('Error loading health reports:', error);
      setHealthReports([]);
    }
  };

  useEffect(() => {
    if (user?.studentId) {
      loadHealthReports(user.studentId);
    }
  }, [user]);

  // Handle Form Submission
  const handleAddReport = async (e) => {
    e.preventDefault();
    
    try {
      // User authentication check
      if (!user?.studentId || !user?.name) {
        throw new Error('User information is missing. Please log in again.');
      }

      // Form validation
      if (!weight || !height) {
        throw new Error("Please enter both weight and height.");
      }

      const weightNum = parseFloat(weight);
      const heightNum = parseFloat(height);

      if (isNaN(weightNum) || isNaN(heightNum)) {
        throw new Error("Weight and height must be valid numbers.");
      }

      if (weightNum <= 0 || heightNum <= 0) {
        throw new Error("Weight and height must be greater than 0.");
      }

      if (weightNum > 500) { // Reasonable maximum weight in kg
        throw new Error("Please enter a valid weight (less than 500 kg).");
      }

      if (heightNum > 300) { // Reasonable maximum height in cm
        throw new Error("Please enter a valid height (less than 300 cm).");
      }

      if (!condition || !condition.trim()) {
        throw new Error("Please enter a health issue.");
      }

      const newBMI = calculateBMI(weightNum, heightNum);
      const reportData = {
        name: user.name,
        age: user.age || 0,
        weight: weightNum,
        height: heightNum,
        bmi: newBMI,
        sleepHours: 7,
        conditions: [condition.trim()],
        description: description.trim(),
        date: new Date().toISOString()
      };

      const formData = new FormData();
      formData.append('studentId', user.studentId);
      formData.append('studentName', user.name);
      formData.append('reportData', JSON.stringify(reportData));
      
      if (pdfFile) {
        if (pdfFile.type !== 'application/pdf') {
          throw new Error('Please upload a valid PDF file.');
        }
        if (pdfFile.size > 5 * 1024 * 1024) { // 5MB limit
          throw new Error('PDF file size must be less than 5MB.');
        }
        formData.append('pdfFile', pdfFile);
      }

      // Call the API to add the health report
      const result = await addHealthReport(formData);
  
      alert("Health report added successfully!");
      await loadHealthReports(user.studentId);
      // Reset all form fields
      setShowForm(false);
      setWeight("");
      setHeight("");
      setCondition("");
      setDescription("");
      setPdfFile(null);
      // Reset the file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) {
        fileInput.value = "";
      }
    } catch (error) {
      console.error("Error adding report:", error);
      alert(error.message || 'Failed to add health report. Please try again.');
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md p-6">
        <h2 className="text-xl font-semibold mb-6">💙 HealthBuzz</h2>
        <ul>
          <li className="p-3 bg-blue-100 text-blue-600 rounded-md mb-2 cursor-pointer" onClick={() => navigate("/dashboard")}>
            🏠 Dashboard
          </li>
          <li className="p-3 hover:bg-gray-200 rounded-md cursor-pointer" onClick={() => navigate("/meal-plan")}>
            📋 Meal Plan
          </li>
          <li className="p-3 hover:bg-gray-200 rounded-md cursor-pointer" onClick={() => navigate("/medicines")}>
            💊 Medicines
          </li>
          <li className="p-3 hover:bg-gray-200 rounded-md cursor-pointer" onClick={() => navigate("/leave-request")}>
            ✈️ Leave
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Health Dashboard</h1>
            <p className="text-gray-500">View and manage your health reports</p>
          </div>
          
          {/* Profile Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setShowProfile(!showProfile)} 
              className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow hover:bg-gray-50"
            >
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <span className="text-gray-700">{user?.name || 'User'}</span>
            </button>

            {showProfile && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                <button 
                  onClick={() => navigate('/profile')} 
                  className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
                >
                  Profile
                </button>
                <button 
                  onClick={() => {
                    localStorage.removeItem('user');
                    navigate('/login');
                  }} 
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ID-Name Container with Add Report Button */}
        <div
          className="border p-4 mt-3 rounded-lg border-blue-500 cursor-pointer hover:bg-blue-50 transition flex justify-between items-center"
          onClick={() => setShowReports(!showReports)}
        >
          <div>
            <h3 className="text-lg font-semibold">
              Health Reports - {user?.studentId || 'N/A'} - 
              {user?.name || 'Unknown'}
            </h3>
            <p className="text-sm text-gray-500">Click to {showReports ? "hide" : "view"} reports</p>
          </div>
          <button
            className="bg-blue-500 text-white px-3 py-2 rounded-md flex items-center"
            onClick={(e) => {
              e.stopPropagation();
              setShowForm(true);
            }}
          >
            <FaPlus className="mr-2" /> Add Report
          </button>
        </div>

        {/* Expanded Reports Section */}
        {showReports && (
            <div className="mt-3">
              {healthReports && healthReports.length > 0 ? (
                healthReports.map((report, index) => {
                  let reportData;
                  try {
                    reportData = typeof report.reportData === 'string' ? JSON.parse(report.reportData) : report.reportData;
                  } catch (error) {
                    console.error('Error parsing report data:', error);
                    return null;
                  }
                  return (
                    <div 
                      key={index} 
                      className="border p-3 rounded-lg mt-2 bg-white shadow-sm cursor-pointer hover:bg-gray-100"
                      onClick={async () => {
                        try {
                          if (!report._id) {
                            throw new Error('Report ID is missing');
                          }
                          const reportDetails = await fetchReportById(report._id);
                          if (!reportDetails || !reportDetails.reportData) {
                            throw new Error('Report data is missing or invalid');
                          }
                          
                          const parsedReportData = typeof reportDetails.reportData === 'string' 
                            ? JSON.parse(reportDetails.reportData) 
                            : reportDetails.reportData;
                          
                          // Fetch PDF if available
                          if (reportDetails.hasPdf) {
                            const response = await fetch(`http://localhost:3001/api/health-reports/${report._id}/pdf`);
                            if (response.ok) {
                              reportDetails.pdfUrl = URL.createObjectURL(await response.blob());
                            }
                          }

                          setSelectedReport({
                            ...reportDetails,
                            bmi: parsedReportData.bmi,
                            sleepHours: parsedReportData.sleepHours,
                            conditions: parsedReportData.conditions || [],
                            description: parsedReportData.description || '',
                            date: reportDetails.date,
                            studentName: reportDetails.studentName,
                            pdfUrl: reportDetails.pdfUrl
                          });
                          setShowReportDetails(true);
                        } catch (error) {
                          console.error('Error fetching report details:', error);
                          alert(`Failed to load report details: ${error.message}`);
                        }
                      }}
                    >
                      <p className="text-sm text-gray-500">Updated: {report.date?.split("T")[0] || "N/A"}</p>
                      <div className="flex text-gray-700 mt-2">
                        <span className="mr-4">⚖️ BMI: {reportData.bmi}</span>
                        <span>🛌 {reportData.sleepHours} hours</span>
                      </div>
                      <div className="mt-2">
                        {reportData.conditions && reportData.conditions.length > 0 ? (
                          reportData.conditions.map((cond, i) => (
                            <span key={i} className="bg-gray-200 px-2 py-1 text-sm rounded-full mr-2">
                              {cond}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-500 text-sm">No conditions reported</span>
                        )}
                      </div>
                    </div>
                  );
                }).filter(Boolean)
              ) : (
                <p className="text-gray-500 text-sm mt-3">No reports available</p>
              )}
            </div>
          )}
        </div>

      {/* Add Report Form (Modal) */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Add New Health Report</h2>
            <form onSubmit={handleAddReport}>
              <div className="mb-3">
                <label className="block text-gray-700">Weight (kg)</label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === '' || (parseFloat(val) > 0 && parseFloat(val) <= 500)) {
                      setWeight(val);
                    }
                  }}
                  className="w-full p-2 border rounded-md"
                  required
                  min="1"
                  max="500"
                  step="0.1"
                />
              </div>
              <div className="mb-3">
                <label className="block text-gray-700">Height (cm)</label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === '' || (parseFloat(val) > 0 && parseFloat(val) <= 300)) {
                      setHeight(val);
                    }
                  }}
                  className="w-full p-2 border rounded-md"
                  required
                  min="1"
                  max="300"
                  step="0.1"
                />
              </div>
              <div className="mb-3">
                <label className="block text-gray-700">Health Issue</label>
                <input
                  type="text"
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter your health issue"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="block text-gray-700">Upload PDF Report (optional)</label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setPdfFile(e.target.files[0])}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div className="mb-3">
                <label className="block text-gray-700">Description (optional)</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter additional details about your health condition"
                  rows="3"
                />
              </div>
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">Submit</button>
            </form>
          </div>
        </div>
      )}

      {/* Report Details Modal */}
      {showReportDetails && selectedReport && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-[600px] shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-xl leading-6 font-medium text-gray-900 mb-4">Report Details</h3>
              <div className="mt-2 px-7 py-3 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Student Name</p>
                    <p className="text-base">{selectedReport.studentName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Date</p>
                    <p className="text-base">{new Date(selectedReport.date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">BMI</p>
                    <p className="text-base">{selectedReport.bmi}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Sleep Hours</p>
                    <p className="text-base">{selectedReport.sleepHours}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Conditions</p>
                  <p className="text-base">{selectedReport.conditions?.join(', ') || 'None'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Description</p>
                  <p className="text-base">{selectedReport.description}</p>
                </div>
                {selectedReport.pdfUrl && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Attached Document</p>
                    <a 
                      href={selectedReport.pdfUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      View Document
                    </a>
                  </div>
                )}
              </div>
              <div className="items-center px-4 py-3">
                <button
                  onClick={() => setShowReportDetails(false)}
                  className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
