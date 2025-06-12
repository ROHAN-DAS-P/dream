import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';

export default function RepoList() {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const res = await fetch('/api/repo', {
          credentials: 'include',
        });

        
        if (res.status === 401) {
          // Token expired → redirect to login
          window.location.href = '/';
          return;
        }

        const data = await res.json();

        if (res.ok) {
          setRepos(data);
          setError('');
        } else {
          setError(data.error || 'Failed to fetch repositories');
        }
      } catch (err) {
        console.error('Error fetching repos:', err);
        setError('Error fetching repositories');
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, []);

  if (loading) {
    return (
      <div>
        <Header />
        <p className="text-center mt-10">Loading repositories...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Header />
        <p className="text-center text-red-600 mt-10">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="max-w-6xl mx-auto mt-10 px-4">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">My Repositories ({repos.length})</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {repos.map((repo) => (
            <div key={repo.id} className="bg-white shadow-md rounded-lg p-5 border border-gray-200">
              <h2 className="text-lg font-semibold text-blue-700 mb-2">{repo.name}</h2>
              <p className="text-sm text-gray-600 mb-4">{repo.description || 'No description'}</p>

              <div className="flex flex-col space-y-2">
                <button
                  onClick={() => navigate(`/repos/${repo.id}`)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                  View Details
                </button>

                <button
                  onClick={() => navigate(`/repos/${repo.id}/issues`)}
                  className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded"
                >
                  View Issues
                </button>

                <button
                  onClick={() => navigate(`/repos/${repo.id}/pulls`)}
                  className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded"
                >
                  View Pull Requests
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
