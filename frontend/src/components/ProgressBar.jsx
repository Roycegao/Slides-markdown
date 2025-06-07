import React from 'react';

export default function ProgressBar({ current, total, onNext, onPrev }) {
  const percent = (current / total) * 100;
  return (
    <div
      style={{
        height: 30,
        background: '#ddd',
        display: 'flex',
        alignItems: 'center',
        padding: '0 10px',
      }}
    >
      <button onClick={onPrev} disabled={current <= 1}>
        Prev
      </button>
      <div style={{ flex: 1, margin: '0 10px', background: '#fff', height: 10 }}>
        <div
          style={{ width: `${percent}%`, background: 'dodgerblue', height: '100%' }}
        />
      </div>
      <button onClick={onNext} disabled={current >= total}>
        Next
      </button>
      <span>
        {current} / {total}
      </span>
    </div>
  );
}
