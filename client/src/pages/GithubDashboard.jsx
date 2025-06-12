import React, { useEffect, useState } from "react";
import axios from "axios";

const GitHubDashboard = () => {
  const [user, setUser] = useState(null);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [scope, setScope] = useState("user");
  const [repos, setRepos] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [issues, setIssues] = useState([]);
  const [pulls, setPulls] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("issues");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/api/auth/me");
        setUser(res.data);
      } catch (err) {
        console.error("Failed to fetch user info", err);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (search.trim() === "") return setSuggestions([]);
      try {
        const res = await axios.get(`/api/repo/search?q=${search}&type=${scope}`);
        setSuggestions(res.data);
      } catch (err) {
        console.error("Error fetching suggestions", err);
      }
    };
    const delayDebounceFn = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [search, scope]);

  const handleClearSearch = () => {
    setSearch("");
    setRepos([]);
    setSuggestions([]);
    setSelectedRepo(null);
    setIssues([]);
    setPulls([]);
  };

  const fetchDetails = async (repo) => {
    try {
      setSelectedRepo(repo);
      setSuggestions([]);
      setRepos([]);
      const issuesEndpoint = scope === "user"
        ? `/api/repo/${repo.id}/issues`
        : `/api/repo/${repo.owner}/${repo.name}/issues`;
      const pullsEndpoint = scope === "user"
        ? `/api/repo/${repo.id}/pull`
        : `/api/repo/${repo.owner}/${repo.name}/pull`;

      const [issuesRes, pullsRes] = await Promise.all([
        axios.get(issuesEndpoint),
        axios.get(pullsEndpoint),
      ]);
      setIssues(issuesRes.data.slice(0, 5));
      setPulls(pullsRes.data.slice(0, 5));
    } catch (err) {
      console.error("Error fetching repo details", err);
    }
  };

  const filterData = (data) => {
    return data.filter((item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {user && (
        <div className="mb-6 flex items-center space-x-4">
          <img src={user.avatar_url} alt="User Avatar" className="w-12 h-12 rounded-full" />
          <div>
            <h1 className="text-xl font-bold">{user.name || user.login}</h1>
            <p className="text-gray-600">{user.email || "No email provided"}</p>
          </div>
        </div>
      )}

      <div className="mb-4 relative">
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Search repositories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-3 py-2 rounded w-full"
          />
          <button
            onClick={handleClearSearch}
            className="px-3 py-2 border rounded text-sm text-gray-700 hover:bg-gray-100"
          >
            Clear
          </button>
          <select
            value={scope}
            onChange={(e) => setScope(e.target.value)}
            className="border px-3 py-2 rounded"
          >
            <option value="user">My Repos</option>
            <option value="global">Global</option>
          </select>
        </div>
        {suggestions.length > 0 && (
          <ul className="absolute z-10 bg-white border w-full mt-1 rounded shadow max-h-64 overflow-y-auto">
            {suggestions.map((repo) => (
              <li
                key={repo.id}
                onClick={() => fetchDetails(repo)}
                className="px-4 py-2 cursor-pointer hover:bg-gray-100"
              >
                {repo.full_name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {selectedRepo && (
        <div className="mt-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold">{selectedRepo.full_name}</h2>
            <p className="text-sm text-blue-600">
              <a href={selectedRepo.html_url} target="_blank" rel="noopener noreferrer">
                {selectedRepo.html_url}
              </a>
            </p>
          </div>

          <div className="flex space-x-4 mb-2">
            <button
              onClick={() => setActiveTab("issues")}
              className={`px-4 py-2 rounded ${activeTab === "issues" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
            >
              Issues
            </button>
            <button
              onClick={() => setActiveTab("pulls")}
              className={`px-4 py-2 rounded ${activeTab === "pulls" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
            >
              Pull Requests
            </button>
          </div>

          <input
            type="text"
            placeholder="Filter by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border px-3 py-2 rounded mb-4 w-full"
          />

          {activeTab === "issues" && (
            <div>
              {filterData(issues).map((issue) => (
                <div key={issue.id} className="border-b py-2">
                  <a
                    href={issue.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-700 font-semibold"
                  >
                    #{issue.number} - {issue.title}
                  </a>
                </div>
              ))}
            </div>
          )}

          {activeTab === "pulls" && (
            <div>
              {filterData(pulls).map((pr) => (
                <div key={pr.id} className="border-b py-2">
                  <a
                    href={pr.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-700 font-semibold"
                  >
                    #{pr.number} - {pr.title}
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GitHubDashboard;
