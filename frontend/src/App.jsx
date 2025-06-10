import React, { useState, useEffect, useRef } from "react";
import MDEditor, { commands } from "@uiw/react-md-editor";
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import "highlight.js/styles/github.css";
import "./styles/global.css";
import "./styles/editor.css";
import HotKeys from './components/HotKeys';
import SlidePreview from './components/SlidePreview';
import { fetchSlides, createSlide, updateSlide as updateSlideApi, deleteSlide as deleteSlideApi } from './services/api';
import DraggableSlideList from './components/DraggableSlideList';
import { 
  AddIcon, 
  RemoveIcon, 
  FullscreenIcon, 
  FullscreenExitIcon, 
  UpIcon, 
  DownIcon,
  BackIcon,
  CloseIcon
} from './components/Icons';

function isMobileByUA() {
  if (typeof navigator === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function isLandscape() {
  return window.matchMedia && window.matchMedia('(orientation: landscape)').matches;
}

export default function App() {
  const [slides, setSlides] = useState([]);
  const [currentSlideId, setCurrentSlideId] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saveTimeout, setSaveTimeout] = useState(null);
  const [prevIndex, setPrevIndex] = useState(0);
  const [mobileTab, setMobileTab] = useState('sidebar');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768 || isMobileByUA());
  const [isLandscapeMode, setIsLandscapeMode] = useState(isLandscape());

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
        setError('Error loading slides');
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
      if (saveTimeout) {
        clearTimeout(saveTimeout);
      }
      const timeoutId = setTimeout(async () => {
        try {
          await updateSlideApi(slideId, updates);
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
    // 只本地 setSlides，不要用新对象替换整个 slide
    setSlides(prev =>
      prev.map(s =>
        s.id === currentSlideId ? { ...s, content: contentValue } : s
      )
    );
    // 只做后端同步
    debouncedSave(currentSlideId, { ...currentSlide, content: contentValue });
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
        layout: 'default',
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

  // 监听窗口宽度变化，进入移动端时自动切tab到sidebar
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768 || isMobileByUA());
      setIsLandscapeMode(isLandscape());
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 滑动手势处理（仅移动端全屏预览）
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);
  const touchEndX = useRef(null);
  const touchEndY = useRef(null);

  const handleTouchStart = (e) => {
    if (!isMobile || !isFullscreen) return;
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    if (!isMobile || !isFullscreen) return;
    // 判断是否在可横向滚动的内容（代码块、表格等）内
    let el = e.target;
    let blockScroll = false;
    while (el) {
      if (
        el.tagName === 'PRE' ||
        el.tagName === 'CODE' ||
        el.tagName === 'TABLE' ||
        el.tagName === 'TH' ||
        el.tagName === 'TD'
      ) {
        blockScroll = true;
        break;
      }
      el = el.parentElement;
    }
    if (blockScroll) return;

    touchEndX.current = e.changedTouches[0].clientX;
    touchEndY.current = e.changedTouches[0].clientY;
    
    const deltaX = touchEndX.current - touchStartX.current;
    const deltaY = touchEndY.current - touchStartY.current;
    
    // 只有当水平滑动距离大于垂直滑动距离，且水平滑动距离超过阈值时才触发翻页
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 30) {
      if (deltaX < 0 && canNext) handleNext(); // 左滑，下一页
      if (deltaX > 0 && canPrev) handlePrev(); // 右滑，上一页
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
      {/* 竖屏时显示顶部tab，横屏时隐藏 */}
      {isMobile && !isLandscapeMode && !isFullscreen && (
        <div style={{ display: 'flex', width: '100vw', borderBottom: '1px solid #eee', background: 'var(--bg-secondary)', zIndex: 10 }}>
          <button className={`btn${mobileTab === 'sidebar' ? ' btn-primary' : ''}`} style={{ flex: 1 }} onClick={() => setMobileTab('sidebar')}>Slides</button>
          <button className={`btn${mobileTab === 'editor' ? ' btn-primary' : ''}`} style={{ flex: 1 }} onClick={() => setMobileTab('editor')}>Edit</button>
        </div>
      )}
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
        <div className="fullscreen-preview-container" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
          {/* 移动端全屏左上角返回，右上角页码 */}
          {isMobile && (
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', zIndex: 1001, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px' }}>
              <button
                style={{
                  width: 40, height: 40, border: 'none', background: 'rgba(0,0,0,0.1)', color: '#fff', borderRadius: '50%', fontSize: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', cursor: 'pointer'
                }}
                onClick={() => setIsFullscreen(false)}
                aria-label="back"
                title="back"
              >
                <BackIcon style={{ width: 20, height: 20 }} />
              </button>
              <div className="slide-page-number" style={{ position: 'static', color: '#fff', fontSize: 18, background: 'rgba(0,0,0,0.1)', borderRadius: 20, padding: '4px 14px', minWidth: 60, textAlign: 'center', fontWeight: 500 }}>
                {currentIndex + 1}/{slides.length}
              </div>
            </div>
          )}
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
                isMobile={isMobile}
              />
            </CSSTransition>
          </TransitionGroup>
        </div>
      </CSSTransition>
      {/* 横屏时，移动端只显示左侧 sidebar（目录+按钮+DraggableSlideList）和右侧 markdown 编辑器，不渲染预览部分 */}
      {isMobile && isLandscapeMode && !isFullscreen && (
        <>
          <div className="sidebar active">
            <div className="sidebar-header">
              <h1 className="sidebar-title">Slides</h1>
              <div className="slide-navigation">
                <button className="btn" onClick={addNewSlide} title="Add Slide">
                  <AddIcon />
                </button>
                <button className="btn" onClick={() => deleteSlide(currentSlideId)} disabled={!canDelete} title="Delete Slide">
                  <RemoveIcon />
                </button>
                <button className="btn" onClick={() => handleToggleFullscreen('button')} title={isFullscreen ? 'esc' : 'preview'}>
                  {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
                </button>
              </div>
            </div>
            <DraggableSlideList
              slides={slides}
              currentSlideId={currentSlideId}
              onSelect={handleSlideSelect}
              onReorder={handleReorder}
            />
          </div>
          <div className="editor-container active">
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
                  commands.title,  
                  commands.hr,
                  commands.bold,
                  commands.italic,
                  commands.strikethrough,
                  commands.divider,
                  commands.link,
                  commands.image,
                  commands.code,
                  commands.codeBlock,
                  commands.unorderedListCommand,
                  commands.orderedListCommand,
                  commands.checkedListCommand,
                  commands.quote,
                  commands.table,
                ]}
                extraCommands={[]}
              />
            </div>
          </div>
        </>
      )}
      {/* 竖屏时，移动端tab切换内容 */}
      {isMobile && !isLandscapeMode && !isFullscreen && (
        <>
          <div className={`sidebar${mobileTab !== 'sidebar' ? '' : ' active'}`}> 
            <div className="sidebar-header">
              <h1 className="sidebar-title">Slides</h1>
              <div className="slide-navigation">
                <button className="btn" onClick={addNewSlide} title="Add Slide">
                  <AddIcon />
                </button>
                <button className="btn" onClick={() => deleteSlide(currentSlideId)} disabled={!canDelete} title="Delete Slide">
                  <RemoveIcon />
                </button>
                <button className="btn" onClick={() => handleToggleFullscreen('button')} title={isFullscreen ? 'esc' : 'preview'}>
                  {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
                </button>
              </div>
            </div>
            <DraggableSlideList
              slides={slides}
              currentSlideId={currentSlideId}
              onSelect={handleSlideSelect}
              onReorder={handleReorder}
            />
          </div>
          <div className={`editor-container${mobileTab !== 'editor' ? '' : ' active'}`}> 
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
                  commands.title,  
                  commands.hr,
                  commands.bold,
                  commands.italic,
                  commands.strikethrough,
                  commands.divider,
                  commands.link,
                  commands.image,
                  commands.code,
                  commands.codeBlock,
                  commands.unorderedListCommand,
                  commands.orderedListCommand,
                  commands.checkedListCommand,
                  commands.quote,
                  commands.divider,
                  commands.table,
                ]}
                extraCommands={[]}
              />
            </div>
          </div>
        </>
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
            aria-label="Close"
            title="Close"
          >
            <CloseIcon style={{ width: 20, height: 20 }} />
          </button>
        </div>
      )}
      {/* PC端默认布局 */}
      {!isMobile && !isFullscreen && (
        <>
          <div className="sidebar">
            <div className="sidebar-header">
              <h1 className="sidebar-title">Slides</h1>
              <div className="slide-navigation">
                <button className="btn" onClick={handlePrev} title="Previous">
                  <UpIcon />
                </button>
                <button className="btn" onClick={addNewSlide} title="Add Slide">
                  <AddIcon />
                </button>
                <button className="btn" onClick={() => deleteSlide(currentSlideId)} disabled={!canDelete} title="Delete Slide">
                  <RemoveIcon />
                </button>
                <button className="btn" onClick={() => handleToggleFullscreen('button')} title={isFullscreen ? 'esc' : 'preview'}>
                  {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
                </button>
                <button className="btn" onClick={handleNext} title="Next">
                  <DownIcon />
                </button>
              </div>
            </div>
            <DraggableSlideList
              slides={slides}
              currentSlideId={currentSlideId}
              onSelect={handleSlideSelect}
              onReorder={handleReorder}
            />
          </div>
          <div className="preview-container">
            <div className="preview-content">
              <SlidePreview
                content={typeof currentSlide?.content === 'string' ? currentSlide.content : ''}
                metadata={currentSlide?.metadata || {}}
                isFullscreen={false}
                currentIndex={currentIndex}
                totalSlides={slides.length}
                isMobile={isMobile}
              />
            </div>
          </div>
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
                  commands.title,  
                  commands.hr,
                  commands.bold,
                  commands.italic,
                  commands.strikethrough,
                  commands.divider,
                  commands.link,
                  commands.image,
                  commands.code,
                  commands.codeBlock,
                  commands.unorderedListCommand,
                  commands.orderedListCommand,
                  commands.checkedListCommand,
                  commands.quote,
                  commands.table,
                ]}
                extraCommands={[]}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

