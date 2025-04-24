import React from 'react';

export default function RunModeModal({ visible, onSelect, onClose }) {
  if (!visible) return null;
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'rgba(0,0,0,0.38)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{
        background: '#23232a', color: '#fff', padding: 32, borderRadius: 16, minWidth: 320, boxShadow: '0 8px 32px #0008', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18
      }}>
        <h2 style={{ margin: 0, marginBottom: 12, fontWeight: 700, fontSize: 20 }}>Choose Run Mode</h2>
        <button style={{ padding: '10px 28px', fontSize: 16, borderRadius: 8, marginBottom: 8, background: '#bef264', color: '#23232a', border: 'none', fontWeight: 600, cursor: 'pointer' }} onClick={() => onSelect('cmd')}>Run via CMD</button>
        <button style={{ padding: '10px 28px', fontSize: 16, borderRadius: 8, background: '#bef264', color: '#23232a', border: 'none', fontWeight: 600, cursor: 'pointer' }} onClick={() => onSelect('api')}>Run via API (hidden CMD)</button>
        <button style={{ marginTop: 18, color: '#a1a1aa', background: 'none', border: 'none', fontSize: 15, cursor: 'pointer' }} onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}
