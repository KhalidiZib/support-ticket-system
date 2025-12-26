import React, { useState, useEffect } from "react";
import Layout from "../../components/layout/Layout";
import SearchBar from "../../components/ui/SearchBar";
import { globalSearch } from "../../services/searchService";
import { useNavigate, useSearchParams } from "react-router-dom";
import LocationDetailsModal from "../../components/shared/LocationDetailsModal";

export default function SearchResults() {
  const [results, setResults] = useState(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");

  // State for Location Modal
  const [selectedLocation, setSelectedLocation] = useState(null);

  const runSearch = async (value) => {
    try {
      const res = await globalSearch(value);
      const rawList = res.results || [];

      const processed = {
        tickets: rawList.filter(item => item.type === "TICKET"),
        users: rawList.filter(item => item.type === "USER"),
        categories: rawList.filter(item => item.type === "CATEGORY"),
        locations: rawList.filter(item => item.type === "LOCATION"),
      };

      setResults(processed);
    } catch (error) {
      console.error("Search failed:", error);
      setResults({ tickets: [], users: [], categories: [], locations: [] });
    }
  };

  useEffect(() => {
    if (query) {
      runSearch(query);
    }
  }, [query]);

  return (
    <>
      <h1 className="text-2xl font-semibold mb-4">
        Search Results {query && <span className="text-slate-500 font-normal">for "{query}"</span>}
      </h1>

      {/* <SearchBar ... /> Removed to avoid duplication with TopBar */}

      {!results ? (
        <p className="text-gray-500 mt-6">Start typing to search…</p>
      ) : (
        <div className="mt-6 space-y-6">

          {/* Global Empty State */}
          {results.tickets.length === 0 &&
            results.users.length === 0 &&
            results.categories.length === 0 &&
            results.locations.length === 0 && (
              <div className="text-center py-10">
                <p className="text-xl text-slate-600 font-medium">No results found</p>
                <p className="text-slate-400 mt-2">Try adjusting your search terms</p>
              </div>
            )}

          {/* Tickets */}
          {results.tickets.length > 0 && (
            <section>
              <h2 className="font-semibold mb-2">Tickets</h2>
              <ul className="list-disc ml-6 space-y-1">
                {results.tickets.map((t) => (
                  <li
                    key={t.id}
                    className="cursor-pointer text-blue-600 hover:underline"
                    onClick={() => navigate(`/tickets/${t.id}`)}
                  >
                    <span className="font-medium">{t.title}</span> <span className="text-gray-500 text-sm">- {t.description}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Users */}
          {results.users.length > 0 && (
            <section>
              <h2 className="font-semibold mb-2">Users</h2>
              <ul className="list-disc ml-6 space-y-1">
                {results.users.map((u) => (
                  <li
                    key={u.id}
                    className="cursor-pointer text-blue-600 hover:underline"
                    onClick={() => navigate(`/users/${u.id}`)}
                  >
                    <span className="font-medium">{u.title || u.name}</span> <span className="text-gray-500 text-sm">- {u.description || u.email}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Categories */}
          {results.categories.length > 0 && (
            <section>
              <h2 className="font-semibold mb-2">Categories</h2>
              <ul className="list-disc ml-6 space-y-1">
                {results.categories.map((c) => (
                  <li key={c.id}>
                    <span className="font-medium">{c.title}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Locations */}
          {results.locations.length > 0 && (
            <section>
              <h2 className="font-semibold mb-2">Locations</h2>
              <ul className="list-disc ml-6 space-y-1">
                {results.locations.map((l) => (
                  <li
                    key={l.id}
                    className="cursor-pointer text-blue-600 hover:underline"
                    onClick={() => setSelectedLocation(l)}
                  >
                    <span className="font-medium">{l.title}</span> <span className="text-gray-500 text-sm">- {l.description}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

        </div>
      )}

      {/* Location Details Modal */}
      <LocationDetailsModal
        location={selectedLocation}
        onClose={() => setSelectedLocation(null)}
      />
    </>
  );
}
