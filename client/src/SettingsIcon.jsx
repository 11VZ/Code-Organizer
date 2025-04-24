import React from 'react';
// Redesigned settings icon: Gear with more detail and modern look
export default function SettingsIcon({ size = 22, color = '#38bdf8' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4.1" fill={color} opacity=".09" />
      <path d="M19.4 15.1a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1.01 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1.01-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1.01H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1.01 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33c.63-.26 1.01-.88 1.01-1.51V3a2 2 0 1 1 4 0v.09c0 .63.38 1.25 1.01 1.51a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82c.26.63.88 1.01 1.51 1.01H21a2 2 0 1 1 0 4h-.09c-.63 0-1.25.38-1.51 1.01z" />
      <circle cx="12" cy="12" r="2.3" fill={color} opacity=".18" />
      <circle cx="12" cy="12" r="1.1" fill={color} />
    </svg>
  );
}