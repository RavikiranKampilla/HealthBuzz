import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Student Health Portal</h1>
        <p className="mb-8">Manage your health records and more</p>
        <div className="space-x-4">
          <Link to="/login" className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600">
            Login
          </Link>
          <Link to="/signup-student" className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600">
            Student Signup
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
