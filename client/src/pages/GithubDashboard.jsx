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
        console.log("User Data:", res.data);
        setUser(res.data);
      } catch (err) {
        console.error("Failed to fetch user info", err);
      }
    };
    fetchUser();
  }, []);

  const handleSearch = async () => {
    if (!search.trim()) return;
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
    setSearchTerm("");
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
    if (!searchTerm.trim()) return data;
    return data.filter((item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] p-6">
      <Header />
    <div className="bg-slate-200 shadow-md rounded-xl max-w-5xl mx-auto mt-10 p-8 font-sans border border-[#CCD6DD]">
      {user && (
        <div className="flex items-center space-x-4 mb-6">
          <img
            src={user.avatar_url}
            alt="User Avatar"
            className="w-16 h-16 rounded-full border-2 border-[#667788]"
          />
          <div>
            <h1 className="text-xl font-bold text-[#334E68]">{user.name || user.login}</h1>
            <p className="text-sm text-[#7B8794]">{user.email || "No email provided"}</p>
          </div>
        </div>
      )}

      <div className="flex items-center space-x-2 mb-6">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search for repositories..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              handleSearch();
            }}
            className="w-full border border-[#CCD6DD] rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6] bg-white text-[#334E68]"
          />
          <span className="absolute left-3 top-2.5 text-[#3B82F6]">🔍</span>
        </div>
        <button
          onClick={handleClearSearch}
          className="text-sm text-white bg-[#3B82F6] px-4 py-2 rounded-lg hover:bg-[#2563EB]"
        >
          Clear
        </button>
        <select
          value={scope}
          onChange={(e) => setScope(e.target.value)}
          className="text-sm border border-[#CCD6DD] rounded-lg px-3 py-2 bg-white text-[#334E68]"
        >
          <option value="user">User</option>
          <option value="global">Global</option>
        </select>
      </div>

      {repos.map((repo) => (
        <div
          key={repo.id}
          onClick={() => fetchDetails(repo)}
          className="cursor-pointer p-4 rounded-lg bg-white border border-[#CCD6DD] hover:bg-[#F5F7FA] mb-3"
        >
          <a
            href={`https://github.com/${repo.full_name}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-sm text-[#2563EB] hover:underline"
          >
            {repo.full_name}
          </a>
        </div>
      ))}

      {selectedRepo && (
        <div className="mt-6">
          <p className="text-sm font-semibold text-[#334E68] mb-3">
            <a
              href={`https://github.com/${selectedRepo.full_name}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#2563EB] hover:underline"
            >
              {selectedRepo.full_name}
            </a>
          </p>

          <div className="flex space-x-3 mb-4">
            <button
              onClick={() => setActiveTab("issues")}
              className={`text-sm px-4 py-2 rounded-full transition-colors duration-200 ${activeTab === "issues" ? "bg-[#2563EB] text-white" : "bg-[#E2E8F0] text-[#334E68]"}`}
            >
              Issues
            </button>
            <button
              onClick={() => setActiveTab("pulls")}
              className={`text-sm px-4 py-2 rounded-full transition-colors duration-200 ${activeTab === "pulls" ? "bg-[#2563EB] text-white" : "bg-[#E2E8F0] text-[#334E68]"}`}
            >
              Pull Requests
            </button>
          </div>

          <input
            type="text"
            placeholder={`Filter ${activeTab === "issues" ? "issues" : "pull requests"}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4 w-full border border-[#CCD6DD] rounded-lg py-2 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6] bg-white text-[#334E68]"
          />

          <div className="space-y-3">
            {activeTab === "issues" && filterData(issues).map((issue) => (
              <div key={issue.id} className="bg-white p-3 rounded-lg border border-[#D1D5DB]">
                <a
                  href={issue.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-[#2563EB] hover:underline"
                >
                  {issue.title}
                </a>
                <p className="text-xs text-[#4B5563] mt-1">{issue.body?.slice(0, 80) || "No description"}</p>
              </div>
            ))}
            {activeTab === "pulls" && filterData(pulls).map((pr) => (
              <div key={pr.id} className="bg-white p-3 rounded-lg border border-[#D1D5DB]">
                <a
                  href={pr.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-[#2563EB] hover:underline"
                >
                  {pr.title}
                </a>
                <p className="text-xs text-[#4B5563] mt-1">{pr.body?.slice(0, 80) || "No description"}</p>
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
