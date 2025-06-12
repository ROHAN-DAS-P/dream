import React, { useState, useCallback } from 'react';
import debounce from 'lodash.debounce';
import Header from '../components/Header';

export default function Search() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [type, setType] = useState('user');
  const [searchResults, setSearchResults] = useState([]);

  const fetchSuggestions = async (q) => {
    try {
      const res = await fetch(`/api/repo/search?q=${encodeURIComponent(q)}&type=${type}`);
      const data = await res.json();
      setSuggestions(data);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  const debouncedFetch = useCallback(
    debounce((q) => {
      if (q) {
        fetchSuggestions(q);
      } else {
        setSuggestions([]);
      }
    }, 300),
    [type]
  );

  const handleInputChange = (e) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    debouncedFetch(newQuery);
    setSearchResults([]); // clear old results if typing new query
  };

  const handleSearch = async () => {
    if (!query) return;
    try {
      const res = await fetch(`/api/repo/search?q=${encodeURIComponent(query)}&type=${type}`);
      const data = await res.json();
      setSearchResults(data);
      setSuggestions([]); // hide suggestions on search
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div>
      <Header />
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Search Repositories</h1>

      {/* Row with Filter buttons + Input + Clear + Search button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-4 sm:space-y-0 mb-6">
        {/* Filter Buttons */}
        <div className="flex space-x-2">
          <button
            className={`px-4 py-2 rounded-lg border ${
              type === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}
            onClick={() => {
              setType('user');
              setSuggestions([]);
              setSearchResults([]);
            }}
          >
            My Repositories
          </button>
          <button
            className={`px-4 py-2 rounded-lg border ${
              type === 'global' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}
            onClick={() => {
              setType('global');
              setSuggestions([]);
              setSearchResults([]);
            }}
          >
            Global Repositories
          </button>
        </div>

        {/* Input + Clear + Search */}
        <div className="flex flex-grow space-x-2">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search Repositories..."
              value={query}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-12 focus:outline-none focus:ring focus:border-blue-300"
            />
            {query && (
              <button
                onClick={() => {
                  setQuery('');
                  setSuggestions([]);
                  setSearchResults([]);
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                Clear
              </button>
            )}
          </div>
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
          >
            Search
          </button>
        </div>
      </div>

      {/* Suggestions only if no search result yet */}
      {suggestions.length > 0 && searchResults.length === 0 && (
        <ul className="mt-2 space-y-2">
          {suggestions.map((repo) => (
            <li
              key={repo.id}
              className="p-3 bg-white rounded shadow hover:bg-gray-50 transition"
            >
              <a
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 font-semibold"
              >
                {repo.full_name}
              </a>
            </li>
          ))}
        </ul>
      )}

      {/* Search results */}
      {searchResults.length > 0 && (
        <>
          <h2 className="text-xl font-semibold mt-6 mb-2">Search Results:</h2>
          <ul className="space-y-2">
            {searchResults.map((repo) => (
              <li
                key={repo.id}
                className="p-3 bg-white rounded shadow hover:bg-gray-50 transition"
              >
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 font-semibold"
                >
                  {repo.full_name}
                </a>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
    </div>
  );
}
