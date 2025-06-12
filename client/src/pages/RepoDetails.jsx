import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';

export default function RepoDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [repo, setRepo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRepoDetails = async () => {
      try {
        const res = await fetch(`/api/repo/${id}`, {
          credentials: 'include',
        });
        if (res.status === 401) {
          // Token expired → redirect to login
          window.location.href = '/';
          return;
        }
        if (!res.ok) {
          throw new Error('Failed to fetch repo details');
        }
        const data = await res.json();
        setRepo(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchRepoDetails();
  }, [id]);

  return (
    <div>
      <Header />
      <div className="max-w-3xl mx-auto p-6">
        <h2 className="text-3xl font-bold mb-6">Repository Details</h2>

        {loading && <p className="text-blue-500">Loading repository details...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}

        {repo && (
          <div className="border border-gray-300 rounded-lg p-6 shadow-md space-y-4">
            <h3 className="text-2xl font-bold text-blue-700">{repo.full_name}</h3>
            <p className="text-gray-700">{repo.description || 'No description provided.'}</p>
            <p className="text-gray-600">
              ⭐ Stars: {repo.stargazers_count} | 🍴 Forks: {repo.forks_count} | 👀 Watchers: {repo.watchers_count}
            </p>
            <p className="text-gray-600">Default branch: {repo.default_branch}</p>
            <p className="text-gray-600">
              <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                View on GitHub
              </a>
            </p>

            
          </div>
        )}
      </div>
    </div>
  );
}
