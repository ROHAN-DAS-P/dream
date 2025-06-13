import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";

const GitHubDashboard = () => {
  const [user, setUser] = useState(null);
  const [search, setSearch] = useState("");
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

const handleSearch = async () => {
  if (!search.trim()) return; // Skip if search is empty

  try {
    const res = await axios.get(`/api/repo/search?q=${search}&type=${scope}`);
    setRepos(res.data);
    setSelectedRepo(null);
    setIssues([]);
    setPulls([]);
  } catch (err) {
    console.error("Error during repo search", err);
  }
};


  const handleClearSearch = () => {
    setSearch("");
    setRepos([]);
    setSelectedRepo(null);
    setIssues([]);
    setPulls([]);
  };

  const fetchDetails = async (repo) => {
    try {
      setSelectedRepo(repo);
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
    <div>
      <Header />
    <div className="bg-white rounded-xl shadow-md max-w-2xl mx-auto mt-10 p-6 font-sans">
      {user && (
        <div className="flex items-center space-x-4 mb-4">
          <img
            src={user.avatar_url}
            alt="User Avatar"
            className="w-14 h-14 rounded-full"
          />
          <div>
            <h1 className="text-lg font-semibold text-gray-800">{user.name || user.login}</h1>
            <p className="text-sm text-gray-500">{user.email || "No email provided"}</p>
          </div>
        </div>
      )}

      <div className="flex items-center space-x-2 mb-4">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              handleSearch();
            }}
            className="w-full border border-gray-300 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
        </div>
        <button
          onClick={handleClearSearch}
          className="text-sm text-gray-600 px-2 py-1 border border-gray-300 rounded hover:bg-gray-100"
        >
          Clear
        </button>
        <select
          value={scope}
          onChange={(e) => setScope(e.target.value)}
          className="text-sm border border-gray-300 rounded px-3 py-2"
        >
          <option value="user">User</option>
          <option value="global">Global</option>
        </select>
      </div>

      {repos.map((repo) => (
        <div
          key={repo.id}
          onClick={() => fetchDetails(repo)}
          className="cursor-pointer p-3 rounded-md hover:bg-gray-50 border"
        >
          <a
            href={`https://github.com/${repo.full_name}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-sm text-blue-600 hover:underline"
          >
            {repo.full_name}
          </a>
        </div>
      ))}

      {selectedRepo && (
        <div className="mt-4">
          <p className="text-sm font-semibold text-gray-700 mb-2">
            <a
              href={`https://github.com/${selectedRepo.full_name}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {selectedRepo.full_name}
            </a>
          </p>

          <div className="flex space-x-2 mb-3">
            <button
              onClick={() => setActiveTab("issues")}
              className={`text-sm px-3 py-1 rounded-full ${activeTab === "issues" ? "bg-gray-900 text-white" : "bg-gray-200 text-gray-800"}`}
            >
              Issues
            </button>
            <button
              onClick={() => setActiveTab("pulls")}
              className={`text-sm px-3 py-1 rounded-full ${activeTab === "pulls" ? "bg-gray-900 text-white" : "bg-gray-200 text-gray-800"}`}
            >
              Pull Requests
            </button>
          </div>

          <div className="mb-2">
            {activeTab === "issues" && filterData(issues).map((issue) => (
              <div key={issue.id} className="mb-2">
                <a
                  href={issue.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-blue-600 hover:underline"
                >
                  {issue.title}
                </a>
                <p className="text-xs text-gray-500">{issue.body?.slice(0, 80) || "No description"}</p>
              </div>
            ))}
            {activeTab === "pulls" && filterData(pulls).map((pr) => (
              <div key={pr.id} className="mb-2">
                <a
                  href={pr.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-blue-600 hover:underline"
                >
                  {pr.title}
                </a>
                <p className="text-xs text-gray-500">{pr.body?.slice(0, 80) || "No description"}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default GitHubDashboard;
