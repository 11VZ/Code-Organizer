import React from 'react';

export default function ThemeToggle({ dark, setDark }) {
  return (
    <button
      className="theme-toggle"
      title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      onClick={() => setDark(v => !v)}
      aria-label="Toggle theme"
    >
      {dark ? (
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#fde68a" strokeWidth="2"><circle cx="12" cy="12" r="5" fill="#fde68a" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 2v2m0 16v2m10-10h-2M4 12H2m15.07 7.07l-1.41-1.41M6.34 6.34L4.93 4.93m12.02 0l-1.41 1.41M6.34 17.66l-1.41-1.41" /></svg>
      ) : (
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#fbbf24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" /></svg>
      )}
    </button>
  );
}
