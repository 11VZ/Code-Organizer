import React, { useEffect, useState, useRef } from 'react';
import { FolderIcon, DocumentIcon, PlayIcon, CommandLineIcon } from './icons';
import SearchBar from './SearchBar';
import ThemeToggle from './ThemeToggle';
import ExplorerIcon from './ExplorerIcon';
import SettingsIcon from './SettingsIcon';
import SettingsPanel from './SettingsPanel';

function fetchFilesByLanguage() {
  return fetch('/api/files-by-language').then(r => r.json());
}
function fetchFileContent(path) {
  return fetch(`/api/file?path=${encodeURIComponent(path)}`).then(r => r.text());
}
function runFile(path) {
  return fetch('/api/run', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path })
  }).then(r => r.json());
}
function openCmd(path) {
  return fetch('/api/opencmd', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path })
  });
}
function searchFiles(query) {
  return fetch(`/api/search?q=${encodeURIComponent(query)}`).then(r => r.json());
}
function openExplorer(path) {
  return fetch('/api/openexplorer', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path })
  });
}

function LanguageTree({ filesByLang, onSelect, selectedPath, expanded, setExpanded }) {
  return (
    <ul className="folder-list">
      {Object.keys(filesByLang).sort().map(lang => (
        <li key={lang}>
          <div
            className="folder"
            style={{ fontWeight: 600, color: '#bef264', letterSpacing: '.03em', fontSize: 15, cursor: 'pointer' }}
            onClick={() => setExpanded(l => ({ ...l, [lang]: !l[lang] }))}
          >
            <span className="icon"><FolderIcon /></span>
            {lang}
            <span className="lang-badge">{filesByLang[lang].length}</span>
            <span style={{ marginLeft: 'auto', color: '#a1a1aa', fontSize: 17 }}>{expanded[lang] ? '▼' : '▶'}</span>
          </div>
          {expanded[lang] && (
            <ul className="file-list">
              {filesByLang[lang].map(item => (
                <li key={item.path}>
                  <div
                    className={`file${selectedPath === item.path ? ' selected' : ''}`}
                    style={{ paddingLeft: 28 }}
                    onClick={() => onSelect(item.path, false)}
                  >
                    <span className="icon"><DocumentIcon /></span>
                    {item.name}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );
}

export default function App() {
  const [filesByLang, setFilesByLang] = useState({});
  const [selected, setSelected] = useState(null);
  const [content, setContent] = useState('');
  const [runResult, setRunResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const [expanded, setExpanded] = useState({});
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [wrap, setWrap] = useState(true);
  const [showLineNumbers, setShowLineNumbers] = useState(false);
  const [theme, setTheme] = useState('dark');
  const searchTimeout = useRef();

  useEffect(() => {
    fetchFilesByLanguage().then(setFilesByLang);
  }, []);

  useEffect(() => {
    if (selected) {
      setLoading(true);
      fetchFileContent(selected)
        .then(setContent)
        .finally(() => setLoading(false));
    } else {
      setContent('');
    }
    setRunResult(null);
  }, [selected]);

  useEffect(() => {
    if (theme === 'dark') {
      document.body.style.background = '#16171a';
      document.body.style.color = '#e5e7eb';
    } else if (theme === 'light') {
      document.body.style.background = '#f5f6fa';
      document.body.style.color = '#23232a';
    } else {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      if (mq.matches) {
        document.body.style.background = '#16171a';
        document.body.style.color = '#e5e7eb';
      } else {
        document.body.style.background = '#f5f6fa';
        document.body.style.color = '#23232a';
      }
    }
  }, [theme]);

  const handleSelect = (path) => {
    setSelected(path);
    setSearchActive(false);
  };

  const handleRun = async () => {
    setRunResult(null);
    setLoading(true);
    const result = await runFile(selected);
    setRunResult(result);
    setLoading(false);
  };

  const handleOpenCmd = async () => {
    await openCmd(selected);
  };

  const handleOpenExplorer = async () => {
    await openExplorer(selected);
  };

  const handleSearch = (query) => {
    clearTimeout(searchTimeout.current);
    if (!query) {
      setSearchResults([]);
      setSearchActive(false);
      return;
    }
    setSearchLoading(true);
    setSearchActive(true);
    searchTimeout.current = setTimeout(() => {
      searchFiles(query).then(results => {
        setSearchResults(results);
        setSearchLoading(false);
      });
    }, 200);
  };

  const handleCopy = () => {
    if (!content) return;
    navigator.clipboard.writeText(content);
  };

  return (
    <div className="app-container" style={{ background: (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) ? 'linear-gradient(135deg,#18181b 70%,#23232a 100%)' : 'linear-gradient(135deg,#f5f6fa 70%,#e5e7eb 100%)', minHeight: '100vh' }}>
      <aside className="sidebar" style={{
        background: (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) ? 'rgba(35,35,42,0.92)' : 'rgba(255,255,255,0.94)',
        color: (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) ? '#e5e7eb' : '#23232a',
        boxShadow: (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) ? '0 4px 32px #00000033' : '0 4px 32px #d1d5db33',
        borderRadius: '18px',
        margin: 18,
        marginRight: 0,
        padding: '24px 0 24px 12px',
        minWidth: 255,
        maxWidth: 320,
        display: 'flex', flexDirection: 'column',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16, paddingLeft: 10 }}>
          <h2 style={{ flex: 1, color: (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) ? '#fff' : '#18181b', fontWeight: 800, fontSize: 22, letterSpacing: '.01em', margin: 0 }}>Code Organizer</h2>
          <button className="theme-toggle" title="Settings" style={{ marginLeft: 4 }} onClick={() => setSettingsOpen(true)}><SettingsIcon /></button>
        </div>
        <div style={{ padding: '0 14px 0 6px' }}>
          <SearchBar
            onSearch={handleSearch}
            results={searchResults}
            loading={searchLoading}
            onSelect={handleSelect}
          />
        </div>
        <div style={{ flex: 1, overflowY: 'auto', marginTop: 10 }}>
          {!searchActive ? (
            Object.keys(filesByLang).length === 0 ? <div style={{ color: '#71717a', fontSize: 15 }}>No code files found.</div> : (
              <LanguageTree filesByLang={filesByLang} onSelect={handleSelect} selectedPath={selected} expanded={expanded} setExpanded={setExpanded} />
            )
          ) : null}
        </div>
      </aside>
      <main className="main" style={{
        background: (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) ? 'rgba(24,24,27,0.82)' : 'rgba(245,246,250,0.92)',
        borderRadius: '20px',
        margin: 18,
        marginLeft: 0,
        boxShadow: (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) ? '0 4px 32px #00000033' : '0 4px 32px #d1d5db33',
        flex: 1,
        display: 'flex', flexDirection: 'column',
        minHeight: 'calc(100vh - 36px)',
        overflow: 'hidden',
      }}>
        <div className="header" style={{
          background: 'transparent',
          color: (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) ? '#fff' : '#18181b',
          fontWeight: 700,
          fontSize: 20,
          padding: '28px 38px 15px 38px',
          borderBottom: (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) ? '1px solid #23232a' : '1px solid #e5e7eb',
          display: 'flex', alignItems: 'center',
          borderTopLeftRadius: 20, borderTopRightRadius: 20,
          minHeight: 64,
        }}>
          {selected ? (
            <><DocumentIcon /> <span style={{ marginLeft: 10, fontWeight: 600, fontSize: 18 }}>{selected.split(/[\\/]/).pop()}</span>
            <span className="file-info" style={{ marginLeft: 18, fontSize: 14 }}>{selected}</span>
            <span className="lang-badge" style={{ marginLeft: 18 }}>{Object.entries(filesByLang).find(([lang, arr]) => arr.some(f => f.path === selected))?.[0]}</span>
            </>
          ) : <span style={{ color: '#71717a', fontWeight: 500 }}>Select a file to view</span>}
        </div>
        {selected && (
          <div className="file-actions" style={{ paddingLeft: 38, paddingTop: 18, gap: 18, borderBottom: (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) ? '1px solid #23232a' : '1px solid #e5e7eb', background: 'transparent', minHeight: 50 }}>
            <button onClick={handleRun} title="Run file"><PlayIcon /> <span style={{ marginLeft: 5 }}>Run</span></button>
            <button onClick={handleOpenCmd} title="Open CMD"><CommandLineIcon /> <span style={{ marginLeft: 5 }}>CMD</span></button>
            <button onClick={handleOpenExplorer} title="Open in Explorer"><ExplorerIcon /> <span style={{ marginLeft: 5 }}>Explorer</span></button>
            <button onClick={handleCopy} title="Copy code">Copy</button>
            {runResult && runResult.success && (
              <span className="run-success">✔ Output: {runResult.message || runResult.stdout?.slice(0, 100) || 'Success'}</span>
            )}
            {runResult && !runResult.success && (
              <span className="run-error">✖ Error: {runResult.error || runResult.stderr}</span>
            )}
          </div>
        )}
        <div style={{ flex: 1, overflow: 'auto', padding: '34px 44px 34px 44px', fontFamily: 'Fira Mono, Consolas, Menlo, monospace', fontSize: fontSize, borderRadius: 16, margin: 22, background: (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) ? 'rgba(30,32,36,0.98)' : '#fff', color: (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) ? '#e5e7eb' : '#23232a', boxShadow: (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) ? '0 2px 12px #00000018' : '0 2px 12px #d1d5db18', border: (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) ? 'none' : '1px solid #e5e7eb', transition: 'background 0.2s, color 0.2s', whiteSpace: wrap ? 'pre-wrap' : 'pre', overflowX: wrap ? 'auto' : 'scroll', position: 'relative', display: 'flex', alignItems: 'flex-start' }}>
          {showLineNumbers && (
            <div style={{ position: 'sticky', left: 0, top: 0, bottom: 0, width: 38, background: 'transparent', color: '#64748b', textAlign: 'right', fontSize: fontSize * 0.95, userSelect: 'none', pointerEvents: 'none', fontFamily: 'inherit', paddingTop: 0, lineHeight: 1.7, zIndex: 1 }}>
              {content.split('\n').map((_, i) => (
                <div key={i} style={{ height: '1.7em', display: 'flex', alignItems: 'center' }}>{i + 1}</div>
              ))}
            </div>
          )}
          <pre className="code-view" style={{ margin: 0, background: 'transparent', color: 'inherit', border: 'none', fontFamily: 'inherit', fontSize: 'inherit', lineHeight: 1.7, whiteSpace: wrap ? 'pre-wrap' : 'pre', wordBreak: 'break-word', marginLeft: showLineNumbers ? 38 : 0, paddingTop: 0 }}>{loading ? 'Loading…' : content}</pre>
        </div>
      </main>
      <SettingsPanel
        visible={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        fontSize={fontSize}
        setFontSize={setFontSize}
        wrap={wrap}
        setWrap={setWrap}
        showLineNumbers={showLineNumbers}
        setShowLineNumbers={setShowLineNumbers}
        theme={theme}
        setTheme={setTheme}
      />
    </div>
  );
}
