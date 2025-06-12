import React from 'react';

const Login = () => {
  const handleLogin = () => {
    window.location.href = 'http://localhost:3000/api/auth/github';
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-900 to-gray-800 px-4">
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-8 max-w-md w-full text-center shadow-2xl">
        <img
          src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
          alt="GitHub Logo"
          className="mx-auto mb-6 w-20"
        />
        <h2 className="text-2xl font-bold text-white mb-4">Sign in with GitHub</h2>
        <p className="text-gray-400 mb-6">
          Use your GitHub account to securely log in to the dashboard.
        </p>
        <button
          onClick={handleLogin}
          className="bg-white text-gray-900 font-semibold py-3 px-6 rounded-lg w-full hover:bg-gray-200 transition duration-200 flex items-center justify-center gap-2"
        >
          <svg
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 16 16"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M8 0C3.58 0 0 3.58 0 8a8 8 0 0 0 5.47 7.59c.4.07.55-.17.55-.38v-1.34C3.67 14.91 3.22 13.5 3.22 13.5c-.36-.91-.88-1.15-.88-1.15-.72-.5.05-.49.05-.49.8.06 1.22.82 1.22.82.71 1.21 1.87.86 2.33.66.07-.52.28-.86.5-1.06-2.67-.3-5.47-1.34-5.47-5.95 0-1.31.47-2.38 1.23-3.22-.12-.3-.53-1.52.12-3.16 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.02 0 2.05.14 3 .4 2.28-1.55 3.28-1.23 3.28-1.23.65 1.64.24 2.86.12 3.16.77.84 1.23 1.91 1.23 3.22 0 4.62-2.81 5.65-5.49 5.95.29.25.54.73.54 1.48v2.2c0 .21.15.46.55.38A8 8 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
          </svg>
          Authenticate with GitHub
        </button>
      </div>
    </div>
  );
};

export default Login;
