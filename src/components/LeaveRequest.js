import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const LeaveRequest = () => {
  const [userType, setUserType] = useState("student");
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [newLeave, setNewLeave] = useState({ title: "", startDate: null, endDate: null });
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedUserType = localStorage.getItem("userType") || "student";
    setUserType(storedUserType);
    
    // Get user data from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserData(user);
      // Fetch leave requests for the student
      if (user.studentId) {
        fetchLeaveRequests(user.studentId);
      }
    }
  }, []);

  const fetchLeaveRequests = async (studentId) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3001/api/leave-requests/${studentId}`);
      if (!response.ok) throw new Error('Failed to fetch leave requests');
      const data = await response.json();
      
      // Sort leave requests by submission date (newest first)
      const sortedData = data.sort((a, b) => new Date(b.submitted) - new Date(a.submitted));
      setLeaveRequests(sortedData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching leave requests:', error);
      setError('Failed to load leave requests. Please try again later.');
      setLoading(false);
    }
  };

  const handleRequestLeave = async () => {
    if (!newLeave.title.trim() || !newLeave.startDate || !newLeave.endDate || !userData) return;

    try {
      const response = await fetch('http://localhost:3001/api/leave-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId: userData.studentId,
          studentName: userData.name,
          title: newLeave.title,
          date: `${newLeave.startDate.toLocaleDateString()} - ${newLeave.endDate.toLocaleDateString()}`,
          type: 'pending',
          status: 'Pending'
        })
      });

      if (!response.ok) throw new Error('Failed to create leave request');

      const createdLeave = await response.json();
      setLeaveRequests(prev => [createdLeave, ...prev]);
      setNewLeave({ title: "", startDate: null, endDate: null });
      alert('Leave request submitted successfully!');
    } catch (error) {
      console.error('Error creating leave request:', error);
      alert('Failed to submit leave request. Please try again.');
    }
  };

  const handleApproval = async (id, status) => {
    try {
      const response = await fetch(`http://localhost:3001/api/leave-requests/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status })
      });

      if (!response.ok) throw new Error('Failed to update leave request');

      const updatedLeave = await response.json();
      setLeaveRequests(prevRequests =>
        prevRequests.map(leave =>
          leave._id === id ? updatedLeave : leave
        )
      );
    } catch (error) {
      console.error('Error updating leave request:', error);
    }
  };

  // Get pending and previous requests
  const pendingRequests = leaveRequests.filter(leave => leave.status === 'Pending');
  const approvedRequests = leaveRequests.filter(leave => leave.status === 'Approved');
  const rejectedRequests = leaveRequests.filter(leave => leave.status === 'Rejected');

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
          <Link to="/medicines" className="block py-3 px-4 bg-gray-200 rounded-lg hover:bg-blue-500 hover:text-white">
            💊 Medicines
          </Link>
          <Link to="/leave-request" className="block py-3 px-4 bg-blue-500 text-white rounded-lg">
            📝 Leave
          </Link>
        </nav>
        <p className="mt-auto text-sm text-gray-500 italic">
          "Rest is not lazy, it's essential for your mental and physical recovery."
        </p>
      </div>

      {/* Main Content */}
      <div className="w-4/5 p-8 bg-gray-50 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">📝 Leave Requests</h1>
            <p className="text-gray-600">Apply for health-related leave and track status</p>
          </div>
        </div>

        {/* Loading and Error States */}
        {loading && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading your leave requests...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
            <p>{error}</p>
          </div>
        )}

        {/* Student Leave Request Form */}
        {!loading && !error && userType === "student" && (
          <div className="mb-6 p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-2">Request Leave</h2>
            <input
              type="text"
              placeholder="Reason for leave"
              value={newLeave.title}
              onChange={(e) => setNewLeave({ ...newLeave, title: e.target.value })}
              className="w-full p-2 mb-2 border rounded-lg"
            />
            <div className="flex gap-4 mb-2">
              <div className="flex-1">
                <label className="block text-sm text-gray-600 mb-1">Start Date</label>
                <DatePicker
                  selected={newLeave.startDate}
                  onChange={(date) => setNewLeave({ ...newLeave, startDate: date })}
                  className="w-full p-2 border rounded-lg"
                  dateFormat="MMMM d, yyyy"
                  placeholderText="Select start date"
                  minDate={new Date()}
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm text-gray-600 mb-1">End Date</label>
                <DatePicker
                  selected={newLeave.endDate}
                  onChange={(date) => setNewLeave({ ...newLeave, endDate: date })}
                  className="w-full p-2 border rounded-lg"
                  dateFormat="MMMM d, yyyy"
                  placeholderText="Select end date"
                  minDate={newLeave.startDate || new Date()}
                />
              </div>
            </div>
            <button
              onClick={handleRequestLeave}
              disabled={!newLeave.title.trim() || !newLeave.startDate || !newLeave.endDate}
              className={`px-4 py-2 rounded-lg ${newLeave.title && newLeave.startDate && newLeave.endDate
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
            >
              Submit Request
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Pending Requests */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-yellow-600 mb-3">⏳ Pending Requests</h2>
              {pendingRequests.length === 0 ? (
                <p className="text-gray-500 italic">No pending requests</p>
              ) : (
                pendingRequests.map((leave) => (
                  <div key={leave._id} className="bg-white p-4 mt-2 rounded-lg shadow-md flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">{leave.title}</h3>
                      <p className="text-gray-600">{leave.date}</p>
                      <p className="text-xs text-gray-500">Submitted on {new Date(leave.submitted).toLocaleDateString()}</p>
                    </div>
                    <span className="px-3 py-1 text-sm text-yellow-600 bg-yellow-100 rounded-full">{leave.status}</span>
                    {userType === "faculty" && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleApproval(leave._id, "Approved")}
                          className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600"
                        >
                          ✅ Approve
                        </button>
                        <button
                          onClick={() => handleApproval(leave._id, "Rejected")}
                          className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                        >
                          ❌ Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Approved Requests */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-green-600 mb-3">✅ Approved Requests</h2>
              {approvedRequests.length === 0 ? (
                <p className="text-gray-500 italic">No approved requests</p>
              ) : (
                approvedRequests.map((leave) => (
                  <div key={leave._id} className="bg-white p-4 mt-2 rounded-lg shadow-md flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">{leave.title}</h3>
                      <p className="text-gray-600">{leave.date}</p>
                      <p className="text-xs text-gray-500">Submitted on {new Date(leave.submitted).toLocaleDateString()}</p>
                    </div>
                    <span className="px-3 py-1 text-sm text-green-600 bg-green-100 rounded-full">{leave.status}</span>
                  </div>
                ))
              )}
            </div>

            {/* Rejected Requests */}
            <div>
              <h2 className="text-xl font-semibold text-red-600 mb-3">❌ Rejected Requests</h2>
              {rejectedRequests.length === 0 ? (
                <p className="text-gray-500 italic">No rejected requests</p>
              ) : (
                rejectedRequests.map((leave) => (
                  <div key={leave._id} className="bg-white p-4 mt-2 rounded-lg shadow-md flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">{leave.title}</h3>
                      <p className="text-gray-600">{leave.date}</p>
                      <p className="text-xs text-gray-500">Submitted on {new Date(leave.submitted).toLocaleDateString()}</p>
                    </div>
                    <span className="px-3 py-1 text-sm text-red-600 bg-red-100 rounded-full">{leave.status}</span>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LeaveRequest;
