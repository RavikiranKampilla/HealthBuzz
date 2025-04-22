import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen text-gray-600">
      <h1 className="text-3xl font-bold mb-4">404 - Page Not Found</h1>
      <button 
        onClick={() => navigate("/")} 
        className="text-blue-500 hover:underline"
      >
        Go back to Login
      </button>
    </div>
  );
};

export default NotFound;

