import React, { useState, useEffect } from "react";
import MDEditor, { commands } from "@uiw/react-md-editor";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import "highlight.js/styles/github.css";
import "./styles/global.css";
import "./styles/editor.css";
import { parseMarkdown } from "./utils/markdownParser";
import MarkdownASTRenderer from "./components/MarkdownASTRenderer";
import HotKeys from './components/HotKeys';
import HotKeyHints from './components/HotKeyHints';
import SlidePreview from './components/SlidePreview';
import SlideEditor from './components/SlideEditor';
import { fetchSlides, createSlide, updateSlide as updateSlideApi, deleteSlide as deleteSlideApi } from './services/api';
import DraggableSlideList from './components/DraggableSlideList';

const initialSlides = [
  { 
    id: 1, 
    title: "Welcome", 
    content: "# Welcome to Slides\n\nA modern presentation editor built with React.\n\n---\n\n## Features\n\n- ✨ Beautiful themes\n- 📝 Markdown support\n- 🎨 Clean and modern UI\n- ⚡ Fast and responsive",

    metadata: {}
  },
  { 
    id: 2, 
    title: "Getting Started", 
    content: "## Getting Started\n\n1. Create new slides using the + button\n2. Edit content using Markdown\n3. Preview your slides in real-time\n\n---\n\n### Tips\n\n- Use `#` for headings\n- Use `-` for bullet points\n- Use ``` for code blocks",

    metadata: {}
  }
];

export default function App() {
  const [slides, setSlides] = useState([]);
  const [currentSlideId, setCurrentSlideId] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saveTimeout, setSaveTimeout] = useState(null);
  const [prevIndex, setPrevIndex] = useState(0);

  // Load slides
  useEffect(() => {
    async function loadSlides() {
      try {
        setIsLoading(true);
        const data = await fetchSlides();
        setSlides(data);
        if (data.length > 0 && !currentSlideId) {
          setCurrentSlideId(data[0].id);
        }
      } catch (err) {
        setError('Failed to load slides');
        console.error('Error loading slides:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadSlides();
  }, []);

  // Auto-save functionality
  const debouncedSave = async (slideId, updates) => {
    try {
      // Clear previous timer
      if (saveTimeout) {
        clearTimeout(saveTimeout);
      }

      // Set new timer, save after 500ms
      const timeoutId = setTimeout(async () => {
        try {
          const updatedSlide = await updateSlideApi(slideId, updates);
          setSlides(prev =>
            prev.map(s =>
              s.id === slideId ? updatedSlide : s
            )
          );
        } catch (err) {
          setError('Failed to save slide');
          console.error('Error saving slide:', err);
        }
      }, 500);

      setSaveTimeout(timeoutId);
    } catch (err) {
      console.error('Error in debounced save:', err);
    }
  };

  // Clear previous timer
  useEffect(() => {
    return () => {
      if (saveTimeout) {
        clearTimeout(saveTimeout);
      }
    };
  }, [saveTimeout]);

  const currentSlide = slides.find((s) => s.id === currentSlideId);

  const updateContent = (value) => {
    if (!currentSlide) return;

    // Ensure value is a string
    const contentValue = typeof value === 'string' ? value : '';

    const updates = {
      ...currentSlide,
      content: contentValue
    };

    // Update local state
    setSlides(prev =>
      prev.map(s =>
        s.id === currentSlideId ? updates : s
      )
    );

    // Trigger auto-save
    debouncedSave(currentSlideId, updates);
  };

  const updateSlideMetadata = (updates) => {
    if (!currentSlide) return;

    const newUpdates = {
      ...currentSlide,
      ...updates
    };

    // Update local state
    setSlides(prev =>
      prev.map(s =>
        s.id === currentSlideId ? newUpdates : s
      )
    );

    // Trigger auto-save
    debouncedSave(currentSlideId, newUpdates);
  };

  const deleteSlide = async (id) => {
    if (slides.length <= 1) {
      setError('Cannot delete the last slide');
      return;
    }

    try {
      setError(null);
      await deleteSlideApi(id);
      
      // Update local state
      const newSlides = slides.filter(s => s.id !== id);
      setSlides(newSlides);

      // If deleted slide is current, select previous or next
      if (currentSlideId === id) {
        const currentIndex = slides.findIndex(s => s.id === id);
        const newIndex = Math.max(0, currentIndex - 1);
        setCurrentSlideId(newSlides[newIndex].id);
      }
    } catch (err) {
      setError('Failed to delete slide');
      console.error('Error deleting slide:', err);
    }
  };

  const addNewSlide = async () => {
    try {
      setError(null);
      const newSlide = {
        title: `New Slide`,
        content: `# New Slide\n\nStart writing your content here...`,
  
        metadata: {},
        order: slides.length
      };
      const createdSlide = await createSlide(newSlide);
      setSlides(prevSlides => [...prevSlides, createdSlide]);
      setCurrentSlideId(createdSlide.id);
    } catch (err) {
      console.error('Error adding new slide:', err);
      setError('Failed to add new slide');
    }
  };

  const updateSlideTitle = (id, newTitle) => {
    setSlides(prev =>
      prev.map(s =>
        s.id === id ? { ...s, title: newTitle } : s
      )
    );
  };

  const handleNext = () => {
    const currentIndex = slides.findIndex(s => s.id === currentSlideId);
    if (currentIndex < slides.length - 1) {
      setPrevIndex(currentIndex);
      setCurrentSlideId(slides[currentIndex + 1].id);
    }
  };

  const handlePrev = () => {
    const currentIndex = slides.findIndex(s => s.id === currentSlideId);
    if (currentIndex > 0) {
      setPrevIndex(currentIndex);
      setCurrentSlideId(slides[currentIndex - 1].id);
    }
  };

  const handleSlideSelect = (slideId) => {
    const currentIndex = slides.findIndex(s => s.id === currentSlideId);
    const newIndex = slides.findIndex(s => s.id === slideId);
    setPrevIndex(currentIndex);
    setCurrentSlideId(slideId);
  };

  const handleSave = async () => {
    if (currentSlide) {
      try {
        await updateSlideApi(currentSlideId, currentSlide);
      } catch (err) {
        setError('Failed to save slide');
        console.error('Error saving slide:', err);
      }
    }
  };

  const handleToggleFullscreen = (source = 'button') => {
    if (source === 'button') {
      setIsFullscreen(!isFullscreen);
    } else if (source === 'hotkey' && isFullscreen) {
      setIsFullscreen(false);
    }
  };

  const canDelete = slides.length > 1;
  const currentIndex = slides.findIndex(s => s.id === currentSlideId);
  const canNext = currentIndex < slides.length - 1;
  const canPrev = currentIndex > 0;

  const handleReorder = async (reorderedSlides) => {
    try {
      setError(null);
      // Update local state
      setSlides(reorderedSlides);
      
      // Batch update backend
      const updatePromises = reorderedSlides.map(slide => 
        updateSlideApi(slide.id, {
          order: slide.order,
          content: slide.content,
          // layout: slide.layout,
          metadata: slide.metadata
        })
      );
      
      await Promise.all(updatePromises);
    } catch (err) {
      console.error('Error reordering slides:', err);
      setError('Failed to reorder slides');
      // If update fails, reload slides
      fetchSlides().then(setSlides).catch(console.error);
    }
  };

  if (isLoading) {
    return <div className="loading">Loading slides...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!currentSlide) {
    return <div className="no-slides">No slides available. Create a new slide to get started.</div>;
  }

  return (
    <div className={`app-container ${isFullscreen ? 'fullscreen' : ''}`}>
      <HotKeys
        onSave={handleSave}
        onAddSlide={addNewSlide}
        onDeleteSlide={deleteSlide}
        onToggleFullscreen={() => handleToggleFullscreen('hotkey')}
        onNextSlide={handleNext}
        onPrevSlide={handlePrev}
        disabled={!isFullscreen}
      />

      <CSSTransition
        in={isFullscreen}
        timeout={300}
        classNames="fullscreen"
        unmountOnExit
      >
        <div className="fullscreen-preview-container">
          {isFullscreen && (
            <div className="slide-progress-bar">
              <div 
                className="progress-fill"
                style={{ 
                  width: `${((currentIndex + 1) / slides.length) * 100}%`
                }}
              />
            </div>
          )}
          <TransitionGroup component={null}>
            <CSSTransition
              key={currentSlideId}
              timeout={300}
              classNames="slide-fade"
              unmountOnExit
            >
              <SlidePreview
                content={typeof currentSlide?.content === 'string' ? currentSlide.content : ''}
                metadata={currentSlide?.metadata || {}}
                isFullscreen={true}
                currentIndex={currentIndex}
                totalSlides={slides.length}
              />
            </CSSTransition>
          </TransitionGroup>
        </div>
      </CSSTransition>

      {!isFullscreen && (
        <div className="sidebar">
          <div className="sidebar-header">
            <h1 className="sidebar-title">Slides</h1>
          </div>
          <DraggableSlideList
            slides={slides}
            currentSlideId={currentSlideId}
            onSelect={handleSlideSelect}
            onReorder={handleReorder}
          />
        </div>
      )}

      {!isFullscreen && (
        <div className="preview-container">
          <div className="preview-toolbar">
            <div className="slide-navigation">
              <button className="btn" onClick={handlePrev} disabled={!canPrev}>
                ←
              </button>
              <div className="slide-actions">
                <button className="btn" onClick={addNewSlide}>
                  +
                </button>
                <button className="btn" onClick={() => deleteSlide(currentSlideId)} disabled={!canDelete}>
                  -
                </button>
                <button className="btn" onClick={() => handleToggleFullscreen('button')}>
                  {isFullscreen ? 'Exit' : 'Preview'}
                </button>
              </div>
              <button className="btn" onClick={handleNext} disabled={!canNext}>
                →
              </button>
            </div>
          </div>
          <div className="preview-content">
            <TransitionGroup component={null}>
              <CSSTransition
                key={currentSlideId}
                timeout={500}
                classNames={currentIndex > prevIndex ? 'slide' : 'slide-prev'}
                unmountOnExit
              >
                <SlidePreview
                  content={typeof currentSlide?.content === 'string' ? currentSlide.content : ''}
                  metadata={currentSlide?.metadata || {}}
                  isFullscreen={true}
                  currentIndex={slides.findIndex(s => s.id === currentSlideId)}
                  totalSlides={slides.length}
                />
              </CSSTransition>
            </TransitionGroup>
          </div>
        </div>
      )}

      {!isFullscreen && (
        <div className="editor-container">
          <div className="editor-content">
            <MDEditor
              value={currentSlide?.content || ''}
              onChange={updateContent}
              height="100%"
              preview="edit"
              hideToolbar={false}
              enableScroll={true}
              className="custom-editor"
              commands={[
                commands.bold,
                commands.italic,
                commands.strikethrough,
                commands.divider,
                commands.link,
                commands.image,
                commands.divider,
                commands.code,
                commands.codeBlock,
                commands.divider,
                commands.unorderedListCommand,
                commands.orderedListCommand,
                commands.checkedListCommand,
                commands.divider,
                commands.quote,
                commands.hr,
                commands.divider,
                // commands.help,
              ]}
              extraCommands={[]}
            />
          </div>
        </div>
      )}

      {error && (
        <div className="error-message" style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          padding: '12px 24px',
          backgroundColor: 'var(--error-bg)',
          color: 'var(--error-text)',
          borderRadius: '4px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          zIndex: 1000
        }}>
          {error}
          <button
            onClick={() => setError(null)}
            style={{
              marginLeft: '12px',
              background: 'none',
              border: 'none',
              color: 'inherit',
              cursor: 'pointer',
              fontSize: '1.2em'
            }}
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}

