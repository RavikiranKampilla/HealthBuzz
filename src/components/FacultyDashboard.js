import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { FiHome, FiCheckCircle } from "react-icons/fi";

const FacultyDashboard = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [studentReports, setStudentReports] = useState({});

  const [motivationalQuotes] = useState([
    "Education is the most powerful weapon which you can use to change the world.",
    "The art of teaching is the art of assisting discovery.",
    "A good teacher can inspire hope, ignite the imagination, and instill a love of learning.",
    "Teachers affect eternity; no one can tell where their influence stops.",
    "Teaching is the one profession that creates all other professions.",
    "It is the supreme art of the teacher to awaken joy in creative expression and knowledge."
  ]);

  const [currentQuote, setCurrentQuote] = useState(0);

  // Fetch students data from MongoDB
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/health-reports/students');
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to fetch student data: ${errorText}`);
        }
        const data = await response.json();
        
        // Group reports by student
        const reportsByStudent = {};
        data.forEach(report => {
          const studentId = report.studentId;
          if (!reportsByStudent[studentId]) {
            reportsByStudent[studentId] = {
              id: studentId,
              name: report.studentName,
              reports: []
            };
          }
          try {
            const reportData = typeof report.reportData === 'string' 
              ? JSON.parse(report.reportData)
              : report.reportData;
            
            reportsByStudent[studentId].reports.push({
              _id: report._id,
              date: report.date,
              data: reportData,
              pdfFileId: report.pdfFileId
            });
          } catch (parseError) {
            console.error(`Error parsing data for report:`, parseError);
          }
        });
        
        setStudents(Object.values(reportsByStudent));
        setStudentReports(reportsByStudent);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // Rotate motivational quotes every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % motivationalQuotes.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [motivationalQuotes.length]);

  // Filter students based on search query
  const filteredStudents = students.filter((student) =>
    student?.name?.toLowerCase().includes(searchQuery.toLowerCase()) || false
  );

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100 justify-center items-center">
        <div className="text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-100 justify-center items-center">
        <div className="text-xl font-semibold text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-6 text-blue-600">HealthBuzz</h2>
          <nav className="space-y-4">
            <NavLink
              to="/faculty-dashboard"
              className={({ isActive }) =>
                isActive
                  ? "flex items-center space-x-3 text-blue-600 font-semibold w-full text-left bg-blue-100"
                  : "flex items-center space-x-3 text-gray-600 hover:text-blue-500"
              }
            >
              <FiHome className="text-lg" />
              <span>Dashboard</span>
            </NavLink>
            <NavLink
              to="/faculty-leaves"
              className={({ isActive }) =>
                isActive
                  ? "flex items-center space-x-3 text-blue-600 font-semibold w-full text-left bg-blue-100"
                  : "flex items-center space-x-3 text-gray-600 hover:text-blue-500"
              }
            >
              <FiCheckCircle className="text-lg" />
              <span>Leave Requests</span>
            </NavLink>
          </nav>
        </div>
        <div className="mt-auto">
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-600 italic">{motivationalQuotes[currentQuote]}</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="mb-6">
          <h2 className="text-3xl font-bold mb-4">Student Health Reports</h2>
          <input
            type="text"
            placeholder="Search students..."
            className="w-full p-3 border rounded-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {selectedStudent ? (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-semibold">{selectedStudent.name}'s Reports</h3>
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg"
              >
                Back to Students
              </button>
            </div>
            <div className="space-y-4">
              {selectedStudent.reports.map((report, index) => (
                <div key={index} className="border p-4 rounded-lg">
                  <p className="font-semibold">Date: {new Date(report.date).toLocaleDateString()}</p>
                  <p>BMI: {report.data.bmi}</p>
                  <p>Age: {report.data.age}</p>
                  {report.data.healthIssue && (
                    <p>Health Issue: {report.data.healthIssue}</p>
                  )}
                  {report.pdfFileId && (
                    <button
                      onClick={async () => {
                        try {
                          const response = await fetch(`http://localhost:3001/api/reports/${report._id}/pdf`);
                          if (!response.ok) throw new Error('Failed to fetch PDF');
                          const blob = await response.blob();
                          const url = window.URL.createObjectURL(blob);
                          window.open(url, '_blank');
                        } catch (error) {
                          console.error('Error viewing PDF:', error);
                          alert('Failed to view PDF');
                        }
                      }}
                      className="mt-2 text-blue-600 hover:text-blue-800"
                    >
                      View PDF Report
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudents.map((student) => (
              <div
                key={student.id}
                className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => setSelectedStudent(student)}
              >
                <h3 className="text-xl font-semibold mb-2">{student.name}</h3>
                <p className="text-gray-600">Total Reports: {student.reports.length}</p>
                <p className="text-gray-600">
                  Latest Report: {student.reports.length > 0 
                    ? new Date(student.reports[student.reports.length - 1].date).toLocaleDateString()
                    : 'No reports'}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default FacultyDashboard;
