import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import SearchResultCard from "./SearchResultCard";

const Search = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      return;
    }

    // Debounced — waits 400ms after the last keystroke before firing, so a fast typist
    // doesn't trigger a request on every single character.
    const timeoutId = setTimeout(async () => {
      setIsLoading(true);
      try {
        const { data } = await axios.get(BASE_URL + "/user/search?q=" + encodeURIComponent(query), {
          withCredentials: true,
        });
        setResults(data.data);
      } catch (err) {
        console.error("Search failed:", err);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleStatusChange = (userId, newStatus) => {
    setResults((prev) =>
      prev.map((u) => (u._id === userId ? { ...u, connectionStatus: newStatus } : u))
    );
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-primary mb-6">Search Developers</h2>

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by name or skill (e.g. React, MongoDB, SAP etc.)..."
        className="input input-bordered w-full mb-6"
        autoFocus
      />

      {isLoading && <p className="text-base-content/60">Searching...</p>}

      {!isLoading && query.trim() && results && results.length === 0 && (
        <p className="text-base-content/60">No developers found matching "{query}".</p>
      )}

      {!isLoading && results && results.length > 0 && (
        <div className="flex flex-col gap-4">
          {results.map((user) => (
            <SearchResultCard key={user._id} user={user} onStatusChange={handleStatusChange} />
          ))}
        </div>
      )}

      {!query.trim() && (
        <p className="text-base-content/50 text-sm">Start typing to search for developers by name or skill.</p>
      )}
    </div>
  );
};

export default Search;