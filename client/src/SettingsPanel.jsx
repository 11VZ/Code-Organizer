import React from 'react';

export default function SettingsPanel({ visible, onClose, fontSize, setFontSize, wrap, setWrap, showLineNumbers, setShowLineNumbers, theme, setTheme }) {
  const [tab, setTab] = React.useState('general');

  if (!visible) return null;
  return (
    <div className="settings-modal" onClick={onClose}>
      <div className="settings-panel" onClick={e => e.stopPropagation()}>
        <h3 style={{ marginBottom: 10 }}>Settings</h3>
        <div className="settings-tabs">
          <button className={tab === 'general' ? 'active' : ''} onClick={() => setTab('general')}>General</button>
          <button className={tab === 'editor' ? 'active' : ''} onClick={() => setTab('editor')}>Editor</button>
        </div>
        {tab === 'general' && (
          <>
            <div className="settings-row">
              <label htmlFor="font-size">Font Size</label>
              <input
                id="font-size"
                type="range"
                min={12}
                max={28}
                value={fontSize}
                onChange={e => setFontSize(Number(e.target.value))}
                style={{ marginLeft: 12 }}
              />
              <span style={{ marginLeft: 10, fontWeight: 600 }}>{fontSize}px</span>
            </div>
            <div className="settings-row">
              <label htmlFor="wrap">Word Wrap</label>
              <input
                id="wrap"
                type="checkbox"
                checked={wrap}
                onChange={e => setWrap(e.target.checked)}
                style={{ marginLeft: 12 }}
              />
            </div>
            <div className="settings-row">
              <label htmlFor="linenumbers">Line Numbers</label>
              <input
                id="linenumbers"
                type="checkbox"
                checked={showLineNumbers}
                onChange={e => setShowLineNumbers(e.target.checked)}
                style={{ marginLeft: 12 }}
              />
            </div>
          </>
        )}
        {tab === 'editor' && (
          <>
            <div className="settings-row">
              <label htmlFor="theme">Theme</label>
              <select id="theme" value={theme} onChange={e => setTheme(e.target.value)} style={{ marginLeft: 12 }}>
                <option value="system">System</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>
            {}
          </>
        )}
        <button className="settings-close" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
