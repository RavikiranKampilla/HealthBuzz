import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase.js";

const SignupFaculty = () => {
  const [facultyId, setFacultyId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async () => {
    if (facultyId.length !== 6 || isNaN(facultyId)) {
      alert("Faculty ID must be a 6-digit number.");
      return;
    }
    if (!name.trim()) {
      alert("Name is required.");
      return;
    }
    if (!email.includes("@")) {
      alert("Enter a valid email.");
      return;
    }
    if (password.length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            faculty_id: facultyId,
            full_name: name,
            user_type: 'faculty'
          }
        }
      });

      if (error) throw error;

      alert("Signup Successful! Please check your email for verification.");
      navigate("/login");
    } catch (error) {
      alert(error.message || "An error occurred during signup.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-center mb-6">Faculty Signup</h2>

        <input
          type="text"
          placeholder="Enter Faculty ID (6 digits)"
          className="w-full p-2 border rounded mb-3"
          value={facultyId}
          onChange={(e) => setFacultyId(e.target.value)}
          maxLength={6}
          required
        />
        <input
          type="text"
          placeholder="Enter Name"
          className="w-full p-2 border rounded mb-3"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Enter Email"
          className="w-full p-2 border rounded mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Create Password (min 6 characters)"
          className="w-full p-2 border rounded mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
          onClick={handleSignup}
          disabled={loading}
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>

        <p className="text-center mt-4">
          Already have an account? <a href="/login" className="text-blue-500">Login here</a>
        </p>
      </div>
    </div>
  );
};

export default SignupFaculty;
