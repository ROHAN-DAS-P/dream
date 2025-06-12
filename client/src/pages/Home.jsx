import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div>
      <Header />
      <div className="flex flex-col items-center justify-center mt-10 space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">GitHub Dashboard </h1>
        <p className="text-gray-600 text-center max-w-md">
          Welcome! You can explore your GitHub data below. Choose an option to continue:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
          <button
            onClick={() => navigate('/repos')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-md transition-all"
          >
            View My Repositories
          </button>

          <button
            onClick={() => navigate('/search')}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg shadow-md transition-all"
          >
            Search Repositories
          </button>

          
        </div>
      </div>
    </div>  );
}
