import { useState } from 'react';

export function useSearch(initial = '') {
  const [query, setQuery] = useState(initial);

  const handleSearchChange = (value) => {
    setQuery(value);
  };

  return { query, setQuery, handleSearchChange };
}
