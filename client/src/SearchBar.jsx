import React, { useState } from 'react';

export default function SearchBar({ onSearch, results, onSelect, loading }) {
  const [query, setQuery] = useState('');

  const handleInput = (e) => {
    setQuery(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <div className="searchbar-container">
      <input
        className="searchbar-input"
        type="text"
        placeholder="Search files..."
        value={query}
        onChange={handleInput}
        autoFocus={false}
      />
      {query && (
        <div className="searchbar-results">
          {loading ? (
            <div className="searchbar-loading">Searching...</div>
          ) : results.length === 0 ? (
            <div className="searchbar-noresult">No results</div>
          ) : (
            results.map((item) => (
              <div
                key={item.path}
                className="searchbar-result"
                onClick={() => onSelect(item.path)}
              >
                <span className="searchbar-result-name">{item.name}</span>
                <span className="searchbar-result-type">{item.codeType}</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
