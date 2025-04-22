import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase.js";

const Login = () => {
  const [userType, setUserType] = useState("student");
  const [email, setEmail] = useState("");
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password || !loginId) {
      alert("Please enter all required fields.");
      return;
    }

    if (userType === "faculty" && (loginId.length !== 6 || isNaN(loginId))) {
      alert("Faculty ID must be a 6-digit number.");
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Verify login ID matches the stored ID
      const storedId = userType === "student" ? 
        data.user.user_metadata.student_id : 
        data.user.user_metadata.faculty_id;

      if (storedId !== loginId) {
        throw new Error("Invalid login ID");
      }

      // Store user data in localStorage
      const userData = {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata.full_name,
        studentId: data.user.user_metadata.student_id,
        facultyId: data.user.user_metadata.faculty_id,
        age: data.user.user_metadata.age,
        userType
      };
      localStorage.setItem('user', JSON.stringify(userData));

      // Navigate based on user type
      if (userType === "student") {
        navigate("/dashboard", { state: { userType } });
      } else {
        navigate("/faculty-dashboard", { state: { userType } });
      }
    } catch (error) {
      alert(error.message || "An error occurred during login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        {/* User Type Selection */}
        <div className="flex justify-center mb-4">
          <button
            className={`px-4 py-2 rounded-l-lg ${
              userType === "student" ? "bg-blue-500 text-white" : "bg-gray-300"
            }`}
            onClick={() => setUserType("student")}
          >
            Student
          </button>
          <button
            className={`px-4 py-2 rounded-r-lg ${
              userType === "faculty" ? "bg-blue-500 text-white" : "bg-gray-300"
            }`}
            onClick={() => setUserType("faculty")}
          >
            Faculty
          </button>
        </div>

        {/* Input Fields */}
        <input
          type="text"
          placeholder={userType === "student" ? "Enter Student ID" : "Enter Faculty ID (6 digits)"}
          className="w-full p-2 border rounded mb-3"
          value={loginId}
          onChange={(e) => setLoginId(e.target.value)}
          maxLength={userType === "faculty" ? 6 : undefined}
          required
        />
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full p-2 border rounded mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Enter your password"
          className="w-full p-2 border rounded mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {/* Login Button */}
        <button
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Signup Options */}
        <p className="text-center mt-4">
          {userType === "student" ? (
            <a href="/signup-student" className="text-blue-500">
              New Student? Sign up here
            </a>
          ) : (
            <a href="/signup-faculty" className="text-blue-500">
              New Faculty? Sign up here
            </a>
          )}
        </p>
      </div>
    </div>
  );
};
export default Login;
