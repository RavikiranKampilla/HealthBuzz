import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard.js";
import FacultyDashboard from "./components/FacultyDashboard.js";
import MealPlan from "./components/MealPlan.js";
import Medicines from "./components/Medicines.js";
import LeaveRequest from "./components/LeaveRequest.js";
import HealthReports from "./components/HealthReports.js";
import FacultyLeaves from "./components/FacultyLeaves.js";
import Login from "./components/Login.js";
import SignupStudent from "./components/SignupStudent.js";
import SignupFaculty from "./components/SignupFaculty.js";
import NotFound from "./components/NotFound.js";
import Profile from "./components/Profile.js";
import Home from "./pages/Home.js";

function App() {
  return (
    <Router>
      <div className="font-sans">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/faculty-dashboard" element={<FacultyDashboard />} />
          <Route path="/meal-plan" element={<MealPlan />} />
          <Route path="/medicines" element={<Medicines />} />
          <Route path="/leave-request" element={<LeaveRequest />} /> {/* ✅ Fixed route */}
          <Route path="/health-reports" element={<HealthReports />} />
          <Route path="/faculty-leaves" element={<FacultyLeaves />} />
          <Route path="/signup-student" element={<SignupStudent />} />
          <Route path="/signup-faculty" element={<SignupFaculty />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
