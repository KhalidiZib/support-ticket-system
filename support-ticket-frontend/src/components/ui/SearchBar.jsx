import React, { useState } from "react";
import { Search, Filter, X } from "lucide-react";
import Button from "./Button";

export default function SearchBar({
  placeholder = "Search...",
  onSearch,
  filters = [],
  initialValue = "",
  className = "",
}) {
  const [searchValue, setSearchValue] = useState(initialValue);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [activeFilters, setActiveFilters] = useState({});

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch?.(searchValue, activeFilters);
  };

  const handleFilterChange = (filterKey, value) => {
    const newFilters = { ...activeFilters };
    if (value) newFilters[filterKey] = value;
    else delete newFilters[filterKey];
    setActiveFilters(newFilters);
    onSearch?.(searchValue, newFilters);
  };

  const clearSearch = () => {
    setSearchValue("");
    setActiveFilters({});
    onSearch?.("", {});
  };

  const removeFilter = (key) => {
    const newFilters = { ...activeFilters };
    delete newFilters[key];
    setActiveFilters(newFilters);
    onSearch?.(searchValue, newFilters);
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <form onSubmit={handleSearch} className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-4 text-gray-400" size={20} />
          <input
            type="text"
            placeholder={placeholder}
            className="w-full pl-12 pr-24 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <div className="absolute right-2 flex items-center space-x-2">
            {searchValue && (
              <button
                type="button"
                onClick={clearSearch}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            )}
            {filters.length > 0 && (
              <div className="relative">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  icon={<Filter size={16} />}
                  onClick={() => setShowFilterDropdown((v) => !v)}
                >
                  Filters
                  {Object.keys(activeFilters).length > 0 && (
                    <span className="ml-1 w-5 h-5 bg-primary-600 text-white text-xs rounded-full flex items-center justify-center">
                      {Object.keys(activeFilters).length}
                    </span>
                  )}
                </Button>
                {showFilterDropdown && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                    <div className="p-4 space-y-3">
                      {filters.map((filter) => (
                        <div key={filter.key}>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {filter.label}
                          </label>
                          {filter.type === "select" ? (
                            <select
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                              value={activeFilters[filter.key] || ""}
                              onChange={(e) =>
                                handleFilterChange(filter.key, e.target.value)
                              }
                            >
                              <option value="">All</option>
                              {filter.options.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <input
                              type={filter.type || "text"}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                              value={activeFilters[filter.key] || ""}
                              onChange={(e) =>
                                handleFilterChange(filter.key, e.target.value)
                              }
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            <Button type="submit" variant="primary" size="sm">
              Search
            </Button>
          </div>
        </div>
      </form>

      {Object.keys(activeFilters).length > 0 && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(activeFilters).map(([key, value]) => (
            <div
              key={key}
              className="inline-flex items-center px-3 py-1.5 bg-primary-50 text-primary-700 rounded-full text-xs"
            >
              <span className="font-medium mr-1">{key}:</span>
              <span>{value}</span>
              <button
                onClick={() => removeFilter(key)}
                className="ml-2 text-primary-700 hover:text-primary-900"
              >
                <X size={14} />
              </button>
            </div>
          ))}
          <button
            onClick={clearSearch}
            className="text-xs text-gray-600 hover:text-gray-900"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}
