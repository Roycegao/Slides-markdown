import React, { useState, useEffect } from 'react';

const LAYOUT_OPTIONS = [
  { value: 'default', label: 'Default' },
  { value: 'title', label: 'Title' },
  { value: 'code', label: 'Code' },
  { value: 'split', label: 'Split' },
  { value: 'image', label: 'Image' }
];

export default function SlideEditor({ slide, onSave }) {
  const [content, setContent] = useState(slide.content);
  const [layout, setLayout] = useState(slide.layout || 'default');
  const [metadata, setMetadata] = useState(slide.metadata || {});

  useEffect(() => {
    setContent(slide.content);
    setLayout(slide.layout || 'default');
    setMetadata(slide.metadata || {});
  }, [slide]);

  function handleSave() {
    onSave({
      content,
      layout,
      metadata
    });
  }

  function handleMetadataChange(key, value) {
    setMetadata(prev => ({
      ...prev,
      [key]: value
    }));
  }

  function renderLayoutMetadata() {
    switch (layout) {
      case 'code':
        return (
          <div className="metadata-group">
            <label htmlFor="code-language">Code Language:</label>
            <input
              id="code-language"
              type="text"
              value={metadata.language || ''}
              onChange={(e) => handleMetadataChange('language', e.target.value)}
              placeholder="e.g. javascript, python"
            />
            <label htmlFor="code-explanation">Explanation:</label>
            <textarea
              id="code-explanation"
              value={metadata.explanation || ''}
              onChange={(e) => handleMetadataChange('explanation', e.target.value)}
              placeholder="Add explanation for the code"
            />
          </div>
        );
      case 'split':
        return (
          <div className="metadata-group">
            <label htmlFor="left-title">Left Title:</label>
            <input
              id="left-title"
              type="text"
              value={metadata.leftTitle || ''}
              onChange={(e) => handleMetadataChange('leftTitle', e.target.value)}
              placeholder="Left section title"
            />
            <label htmlFor="right-title">Right Title:</label>
            <input
              id="right-title"
              type="text"
              value={metadata.rightTitle || ''}
              onChange={(e) => handleMetadataChange('rightTitle', e.target.value)}
              placeholder="Right section title"
            />
          </div>
        );
      case 'image':
        return (
          <div className="metadata-group">
            <label htmlFor="image-url">Image URL:</label>
            <input
              id="image-url"
              type="text"
              value={metadata.imageUrl || ''}
              onChange={(e) => handleMetadataChange('imageUrl', e.target.value)}
              placeholder="Enter image URL"
            />
            <label htmlFor="image-caption">Caption:</label>
            <input
              id="image-caption"
              type="text"
              value={metadata.caption || ''}
              onChange={(e) => handleMetadataChange('caption', e.target.value)}
              placeholder="Image caption"
            />
          </div>
        );
      default:
        return null;
    }
  }

  return (
    <div style={{ flex: 1, padding: 20, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <h3>Edit Slide (Order: {slide.order})</h3>
      
      <div className="editor-section">
        <label htmlFor="slide-layout">Layout:</label>
        <select 
          id="slide-layout"
          value={layout} 
          onChange={e => setLayout(e.target.value)}
          style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
        >
          {LAYOUT_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {renderLayoutMetadata()}

      <div className="editor-section">
        <label htmlFor="slide-content">Content:</label>
        <textarea
          id="slide-content"
          style={{ 
            width: '100%', 
            height: 300,
            padding: '0.5rem',
            fontFamily: 'monospace',
            resize: 'vertical'
          }}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your slide content in Markdown..."
        />
      </div>

      <button 
        onClick={handleSave}
        style={{
          padding: '0.5rem 1rem',
          backgroundColor: 'var(--accent-color)',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Save Changes
      </button>
    </div>
  );
}
