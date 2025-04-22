import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Faculty = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [healthReports, setHealthReports] = useState([]);

  // Fetch all students with health reports
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get('/api/reports/students');
        const uniqueStudents = Array.from(new Map(response.data.map(report => [
          report.studentId,
          {
            id: report.studentId,
            name: report.studentName
          }
        ])).values());
        setStudents(uniqueStudents);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };
    fetchStudents();
  }, []);

  // Fetch health reports for selected student
  const handleStudentClick = async (student) => {
    setSelectedStudent(student);
    try {
      const response = await axios.get(`/api/reports/student/${student.id}`);
      setHealthReports(response.data);
    } catch (error) {
      console.error('Error fetching health reports:', error);
      setHealthReports([]);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Student Health Reports</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Students List */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Students</h2>
          <ul className="space-y-2">
            {students.map((student) => (
              <li
                key={student.id}
                onClick={() => handleStudentClick(student)}
                className={`cursor-pointer p-2 rounded ${selectedStudent?.id === student.id ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
              >
                <span className="font-medium">{student.name}</span>
                <span className="text-gray-500 ml-2">#{student.id}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Health Reports */}
        <div className="md:col-span-2">
          {selectedStudent ? (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">
                Health Reports for {selectedStudent.name}
              </h2>
              {healthReports.length > 0 ? (
                <div className="space-y-4">
                  {healthReports.map((report) => (
                    <div key={report._id} className="border p-4 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-gray-600">
                            Date: {new Date(report.date).toLocaleDateString()}
                          </p>
                          <p className="mt-2">{report.reportData}</p>
                        </div>
                        {report.pdfFileId && (
                          <a
                            href={`/api/health-reports/${report._id}/pdf`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                          >
                            View PDF
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No health reports found for this student.</p>
              )}
            </div>
          ) : (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-gray-500">Select a student to view their health reports.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Faculty;