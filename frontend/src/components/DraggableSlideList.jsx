import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function SlideList({ slides, currentSlideId, onSelect }) {
  return (
    <div className="slides-list">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`slide-item ${slide.id === currentSlideId ? "active" : ""}`}
          onClick={() => onSelect(slide.id)}
        >
          <div className="slide-item-header">
            <div className="slide-item-order">{index + 1}</div>
          </div>
          <div className="slide-item-title">
            {slide.content.split('\n')[0].replace(/^#+\s*/, '')}
          </div>
          <div className="slide-item-preview">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {slide.content.split('\n').slice(1, 3).join('\n')}
            </ReactMarkdown>
          </div>
        </div>
      ))}
    </div>
  );
} 