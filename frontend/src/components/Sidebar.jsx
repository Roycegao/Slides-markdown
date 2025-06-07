import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function Sidebar({ slides, currentIndex, onSelect }) {
  return (
    <div className="sidebar">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          onClick={() => onSelect(index)}
          className={`thumbnail ${index === currentIndex ? 'active' : ''}`}
        >
          <div className="thumb-preview">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {slide.content}
            </ReactMarkdown>
          </div>
        </div>
      ))}
    </div>
  );
}
