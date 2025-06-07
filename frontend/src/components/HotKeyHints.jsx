import React from 'react';

const HOTKEYS = [
  { key: '←', description: 'Previous slide' },
  { key: '→', description: 'Next slide' },
  { key: '⌘/Ctrl + S', description: 'Save' },
  { key: '⌘/Ctrl + N', description: 'New slide' },
  { key: 'Delete', description: 'Delete slide' },
  { key: 'Esc', description: 'Exit fullscreen' }
];

export default function HotKeyHints() {
  return (
    <div className="hotkey-hint">
      {HOTKEYS.map(({ key, description }, index) => (
        <span key={key}>
          <kbd>{key}</kbd>
          <span>{description}</span>
          {index < HOTKEYS.length - 1 && <span style={{ margin: '0 8px' }}>•</span>}
        </span>
      ))}
    </div>
  );
} 