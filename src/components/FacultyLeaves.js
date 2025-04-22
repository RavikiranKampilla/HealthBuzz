import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { FiHome, FiCheckCircle } from "react-icons/fi";

const FacultyLeaves = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch leave requests from the backend
  useEffect(() => {
    const fetchLeaveRequests = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/leave-requests/all', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });

        if (!response.ok) {
          let errorMessage = 'Failed to fetch leave requests';
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
          } else {
            const errorText = await response.text();
            errorMessage = errorText || errorMessage;
          }
          throw new Error(errorMessage);
        }

        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error('Invalid response format: expected an array of leave requests');
        }

        // Sort leave requests by date (newest first)
        const sortedData = data.sort((a, b) => {
          // First sort by status (Pending first)
          if (a.status === 'Pending' && b.status !== 'Pending') return -1;
          if (a.status !== 'Pending' && b.status === 'Pending') return 1;
          
          // Then sort by date (newest first)
          return new Date(b.date) - new Date(a.date);
        });
        setLeaveRequests(sortedData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching leave requests:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchLeaveRequests();
  }, []);


  // Filter leave requests based on search query
  const filteredRequests = leaveRequests.filter((request) =>
    request.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    request.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle approval/rejection of leave requests
  const handleApproval = async (id, newStatus) => {
    try {
      const response = await fetch(`http://localhost:3001/api/leave-requests/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        throw new Error('Failed to update leave request status');
      }

      const updatedRequest = await response.json();
      setLeaveRequests(prevRequests =>
        prevRequests.map(request =>
          request._id === id ? updatedRequest : request
        )
      );
    } catch (err) {
      alert('Error updating leave request: ' + err.message);
    }
  };

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
      <aside className="w-64 bg-white shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-blue-600">HealthBuzz</h2>
        <nav className="space-y-4">
          <NavLink
            to="/faculty-dashboard"
            className={({ isActive }) =>
              isActive
                ? "flex items-center space-x-3 text-blue-600 font-semibold w-full text-left bg-blue-100"
                : "flex items-center space-x-3 text-blue-500 font-semibold w-full text-left"
            }
          >
            <FiHome className="text-lg" />
            <span>Faculty Dashboard</span>
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
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <h2 className="text-3xl font-bold mb-4">Leave Requests</h2>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search by student name or status..."
          className="mb-6 p-3 border rounded-lg w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {!selectedLeave ? (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Student Leave Requests</h3>
            <div className="space-y-4">
              {filteredRequests.map((request) => (
                <div
                  key={request._id}
                  className="p-4 border rounded-lg shadow-md cursor-pointer hover:bg-blue-100"
                  onClick={() => setSelectedLeave(request)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold text-lg">{request.studentName}</h4>
                      <p className="text-gray-600">{request.title}</p>
                      <p className="text-sm text-gray-500">Date: {request.date}</p>
                    </div>
                    <div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${request.status === 'Approved' ? 'bg-green-100 text-green-800' : request.status === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}
                      >
                        {request.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Leave Request Details</h3>
              <button
                onClick={() => setSelectedLeave(null)}
                className="text-blue-600 hover:text-blue-800"
              >
                Back to List
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold">Student Name</h4>
                <p>{selectedLeave.studentName}</p>
              </div>
              <div>
                <h4 className="font-semibold">Reason</h4>
                <p>{selectedLeave.title}</p>
              </div>
              <div>
                <h4 className="font-semibold">Date</h4>
                <p>{selectedLeave.date}</p>
              </div>
              <div>
                <h4 className="font-semibold">Status</h4>
                <p>{selectedLeave.status}</p>
              </div>
              {selectedLeave.status === 'Pending' && (
                <div className="flex space-x-4 mt-6">
                  <button
                    onClick={() => handleApproval(selectedLeave._id, 'Approved')}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleApproval(selectedLeave._id, 'Rejected')}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default FacultyLeaves;
