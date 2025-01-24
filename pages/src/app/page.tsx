"use client";

import { useState } from "react";
import Link from "next/link";
import Head from "next/head";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("darkMode") === "true";
    }
    return false;
  });

  // Fetch results from the backend
  const fetchResults = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/search?q=${searchQuery}`);
      const data = await response.json();
      setResults(data.results || []);
    } catch (error) {
      console.error("Error fetching results:", error);
    }
  };

  // Fetch suggestions dynamically
  const fetchSuggestions = async () => {
    if (searchQuery.length > 2) {
      try {
        const response = await fetch(`http://localhost:5000/api/search?q=${searchQuery}`);
        const data = await response.json();
        setSuggestions(data.results.slice(0, 3)); // Limit to 3 suggestions
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    } else {
      setSuggestions([]);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    localStorage.setItem("darkMode", !darkMode);
    document.documentElement.classList.toggle("dark", !darkMode);
  };

  return (
    <div className={`min-h-screen ${darkMode ? "dark" : ""} bg-gray-100 dark:bg-gray-900`}>
      <Head>
        <title>Media Downloader - Search Movies and Music</title>
        <meta name="description" content="Search, download, and explore movies and music with ease." />
        <meta name="keywords" content="movies, music, downloader, search" />
        <meta property="og:title" content="Media Downloader - Search Movies and Music" />
        <meta property="og:description" content="Search, download, and explore movies and music with ease." />
        <meta property="og:image" content="/images/thumbnail.jpg" /> {/* Update with a relevant image */}
        <meta name="robots" content="index, follow" />
      </Head>

      {/* Header */}
      <header className="flex justify-between items-center p-6 bg-white dark:bg-gray-800 shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
          Media Downloader
        </h1>
        {/* Light/Dark Mode Toggle */}
        <div
          className={`relative w-14 h-8 flex items-center rounded-full px-1 cursor-pointer ${
            darkMode ? "bg-gray-700" : "bg-yellow-400"
          }`}
          onClick={toggleDarkMode}
        >
          <div
            className={`absolute left-1 w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-md transform transition-transform ${
              darkMode ? "translate-x-0" : "translate-x-6"
            }`}
          >
            {darkMode ? (
              <svg className="w-4 h-4 text-gray-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364-6.364l-1.414 1.414M6.636 6.636l-1.414-1.414m12.728 12.728l-1.414-1.414M6.636 17.364l-1.414 1.414M12 7a5 5 0 100 10 5 5 0 000-10z"
                />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-yellow-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364-6.364l-1.414 1.414M6.636 6.636l-1.414-1.414m12.728 12.728l-1.414-1.414M6.636 17.364l-1.414 1.414M12 7a5 5 0 100 10 5 5 0 000-10z"
                />
              </svg>
            )}
          </div>
        </div>
      </header>

      {/* Search Bar */}
      <main className="p-6">
        <div className="max-w-2xl mx-auto">
          <input
            type="text"
            placeholder="Search for movies, music, or media..."
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              fetchSuggestions();
            }}
          />
          <button
            onClick={fetchResults}
            className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Search
          </button>

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="mt-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md max-h-60 overflow-y-scroll">
              {suggestions.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setSearchQuery(item.title);
                    fetchResults();
                    setSuggestions([]);
                  }}
                  className="flex items-center gap-4 p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  <img
                    src={item.image || "/placeholder.png"} // Fallback to placeholder if no image
                    alt={item.title}
                    className="w-12 h-12 object-cover rounded-md"
                  />
                  <p className="text-gray-800 dark:text-gray-200">{item.title}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Results */}
        <div className="mt-8">
          {results.length > 0 ? (
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((item) => (
                <li key={item.id} className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                  <img
                    src={item.image || "/placeholder.png"}
                    alt={item.title}
                    className="w-full h-40 object-cover rounded-lg"
                  />
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-4">
                    {item.title || "No Title"}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">
                    {item.description || "No Description"}
                  </p>
                  <Link href={`/movie/${item.id}`}>
                    <button className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition">
                      Download
                    </button>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-600 dark:text-gray-400">No results found.</p>
          )}
        </div>
      </main>
    </div>
  );
}
