import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import * as api from '../services/api';

// Mock the API functions
vi.mock('../services/api');

// Mock the MDEditor component
vi.mock('@uiw/react-md-editor', () => ({
  default: ({ value, onChange }) => (
    <textarea
      data-testid="md-editor"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
  commands: {
    title: {},
    hr: {},
    bold: {},
    italic: {},
    strikethrough: {},
    divider: {},
    link: {},
    image: {},
    code: {},
    codeBlock: {},
    unorderedListCommand: {},
    orderedListCommand: {},
    checkedListCommand: {},
    quote: {},
    table: {},
  },
}));

// Mock the SlidePreview component
vi.mock('../components/SlidePreview', () => ({
  default: function MockSlidePreview({ content, isFullscreen, currentIndex, totalSlides }) {
    return (
      <div data-testid="slide-preview" data-fullscreen={isFullscreen}>
        <div data-testid="slide-content">{content}</div>
        <div data-testid="slide-info">{currentIndex + 1}/{totalSlides}</div>
      </div>
    );
  },
}));

// Mock the DraggableSlideList component
vi.mock('../components/DraggableSlideList', () => ({
  default: function MockDraggableSlideList({ slides, currentSlideId, onSelect, onReorder }) {
    return (
      <div data-testid="draggable-slide-list">
        {slides.map((slide) => (
          <div
            key={slide.id}
            data-testid={`slide-item-${slide.id}`}
            data-current={slide.id === currentSlideId}
            onClick={() => onSelect(slide.id)}
          >
            {slide.title || 'Untitled'}
          </div>
        ))}
      </div>
    );
  },
}));

// Mock the HotKeys component
vi.mock('../components/HotKeys', () => ({
  default: function MockHotKeys({ onSave, onAddSlide, onDeleteSlide, onToggleFullscreen, onNextSlide, onPrevSlide }) {
    return (
      <div data-testid="hot-keys">
        <button data-testid="save-btn" onClick={() => onSave && onSave()}>Save</button>
        <button data-testid="add-slide-btn" onClick={() => onAddSlide && onAddSlide()}>Add Slide</button>
        <button data-testid="delete-slide-btn" onClick={() => onDeleteSlide && onDeleteSlide('1')}>Delete Slide</button>
        <button data-testid="toggle-fullscreen-btn" onClick={() => onToggleFullscreen && onToggleFullscreen()}>Toggle Fullscreen</button>
        <button data-testid="next-slide-btn" onClick={() => onNextSlide && onNextSlide()}>Next</button>
        <button data-testid="prev-slide-btn" onClick={() => onPrevSlide && onPrevSlide()}>Prev</button>
      </div>
    );
  },
}));

// Mock the Icons components
vi.mock('../components/Icons', () => ({
  AddIcon: () => <span data-testid="add-icon">+</span>,
  RemoveIcon: () => <span data-testid="remove-icon">-</span>,
  FullscreenIcon: () => <span data-testid="fullscreen-icon">⛶</span>,
  FullscreenExitIcon: () => <span data-testid="fullscreen-exit-icon">⛶</span>,
  UpIcon: () => <span data-testid="up-icon">↑</span>,
  DownIcon: () => <span data-testid="down-icon">↓</span>,
  BackIcon: () => <span data-testid="back-icon">←</span>,
  CloseIcon: () => <span data-testid="close-icon">×</span>,
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock window.innerWidth
Object.defineProperty(window, 'innerWidth', {
  writable: true,
  value: 1024,
});

// Mock navigator.userAgent
Object.defineProperty(navigator, 'userAgent', {
  writable: true,
  value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
});

describe('App', () => {
  const mockSlides = [
    {
      id: '1',
      title: 'First Slide',
      content: '# First Slide\n\nContent here',
      layout: 'default',
      metadata: {},
      order: 0,
    },
    {
      id: '2',
      title: 'Second Slide',
      content: '# Second Slide\n\nMore content',
      layout: 'default',
      metadata: {},
      order: 1,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset window properties
    window.innerWidth = 1024;
    navigator.userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  describe('Loading State', () => {
    it('should show loading state initially', () => {
      api.fetchSlides.mockImplementation(() => new Promise(() => {}));
      
      render(<App />);
      
      expect(screen.getByText('Loading slides...')).toBeInTheDocument();
    });

    it('should hide loading state after slides are loaded', async () => {
      api.fetchSlides.mockResolvedValue(mockSlides);
      
      render(<App />);
      
      await waitFor(() => {
        expect(screen.queryByText('Loading slides...')).not.toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('should show error message when loading fails', async () => {
      api.fetchSlides.mockRejectedValue(new Error('Network error'));
      
      render(<App />);
      
      await waitFor(() => {
        expect(screen.getByText('Error loading slides')).toBeInTheDocument();
      });
    });

    it('should show error message when saving fails', async () => {
      api.fetchSlides.mockResolvedValue(mockSlides);
      api.updateSlide.mockRejectedValue(new Error('Save failed'));
      
      render(<App />);
      
      await waitFor(() => {
        expect(screen.getByTestId('md-editor')).toBeInTheDocument();
      });

      const editor = screen.getByTestId('md-editor');
      await userEvent.type(editor, 'New content');

      // Wait for debounced save
      await waitFor(() => {
        expect(screen.getByText('Failed to save slide')).toBeInTheDocument();
      }, { timeout: 1000 });
    });

    it('should show error message when deleting fails', async () => {
      api.fetchSlides.mockResolvedValue(mockSlides);
      api.deleteSlide.mockRejectedValue(new Error('Delete failed'));
      
      render(<App />);
      
      await waitFor(() => {
        expect(screen.getByTestId('delete-slide-btn')).toBeInTheDocument();
      });

      const deleteBtn = screen.getByTestId('delete-slide-btn');
      fireEvent.click(deleteBtn);

      await waitFor(() => {
        expect(screen.getByText('Failed to delete slide')).toBeInTheDocument();
      });
    });

    it('should show error when trying to delete the last slide', async () => {
      const singleSlide = [mockSlides[0]];
      api.fetchSlides.mockResolvedValue(singleSlide);
      
      render(<App />);
      
      await waitFor(() => {
        expect(screen.getByTestId('delete-slide-btn')).toBeInTheDocument();
      });

      const deleteBtn = screen.getByTestId('delete-slide-btn');
      fireEvent.click(deleteBtn);

      await waitFor(() => {
        expect(screen.getByText('Cannot delete the last slide')).toBeInTheDocument();
      });
    });
  });

  describe('Slide Management', () => {
    beforeEach(async () => {
      api.fetchSlides.mockResolvedValue(mockSlides);
      api.createSlide.mockResolvedValue({
        id: '3',
        title: 'New Slide',
        content: '# New Slide\n\nStart writing your content here...',
        layout: 'default',
        metadata: {},
        order: 2,
      });
      api.updateSlide.mockResolvedValue({});
      api.deleteSlide.mockResolvedValue({ success: true });
    });

    it('should load and display slides', async () => {
      render(<App />);
      
      await waitFor(() => {
        expect(screen.getByTestId('draggable-slide-list')).toBeInTheDocument();
      });

      expect(screen.getByTestId('slide-item-1')).toBeInTheDocument();
      expect(screen.getByTestId('slide-item-2')).toBeInTheDocument();
    });

    it('should select the first slide by default', async () => {
      render(<App />);
      
      await waitFor(() => {
        expect(screen.getByTestId('slide-item-1')).toHaveAttribute('data-current', 'true');
      });
    });

    it('should add a new slide', async () => {
      render(<App />);
      
      await waitFor(() => {
        expect(screen.getByTestId('add-slide-btn')).toBeInTheDocument();
      });

      const addBtn = screen.getByTestId('add-slide-btn');
      fireEvent.click(addBtn);

      await waitFor(() => {
        expect(api.createSlide).toHaveBeenCalledWith({
          title: 'New Slide',
          content: '# New Slide\n\nStart writing your content here...',
          layout: 'default',
          metadata: {},
          order: 2,
        });
      });
    });

    it('should delete a slide', async () => {
      render(<App />);
      await waitFor(() => {
        expect(screen.getByTestId('delete-slide-btn')).toBeInTheDocument();
      });
      const deleteBtn = screen.getByTestId('delete-slide-btn');
      fireEvent.click(deleteBtn);
      await waitFor(() => {
        expect(api.deleteSlide).toHaveBeenCalledWith('1');
      });
    });

    it('should update slide content', async () => {
      render(<App />);
      
      await waitFor(() => {
        expect(screen.getByTestId('md-editor')).toBeInTheDocument();
      });

      const editor = screen.getByTestId('md-editor');
      await userEvent.clear(editor);
      await userEvent.type(editor, 'Updated content');

      // Wait for debounced save
      await waitFor(() => {
        expect(api.updateSlide).toHaveBeenCalled();
      }, { timeout: 1000 });
    });

    it('should handle slide selection', async () => {
      render(<App />);
      
      await waitFor(() => {
        expect(screen.getByTestId('slide-item-2')).toBeInTheDocument();
      });

      const secondSlide = screen.getByTestId('slide-item-2');
      fireEvent.click(secondSlide);

      await waitFor(() => {
        expect(secondSlide).toHaveAttribute('data-current', 'true');
      });
    });
  });

  describe('Navigation', () => {
    beforeEach(async () => {
      api.fetchSlides.mockResolvedValue(mockSlides);
      api.updateSlide.mockResolvedValue({});
    });

    it('should navigate to next slide', async () => {
      render(<App />);
      
      await waitFor(() => {
        expect(screen.getByTestId('next-slide-btn')).toBeInTheDocument();
      });

      const nextBtn = screen.getByTestId('next-slide-btn');
      fireEvent.click(nextBtn);

      await waitFor(() => {
        expect(screen.getByTestId('slide-item-2')).toHaveAttribute('data-current', 'true');
      });
    });

    it('should navigate to previous slide', async () => {
      render(<App />);
      
      await waitFor(() => {
        expect(screen.getByTestId('next-slide-btn')).toBeInTheDocument();
      });

      // First go to second slide
      const nextBtn = screen.getByTestId('next-slide-btn');
      fireEvent.click(nextBtn);

      await waitFor(() => {
        expect(screen.getByTestId('slide-item-2')).toHaveAttribute('data-current', 'true');
      });

      // Then go back to first slide
      const prevBtn = screen.getByTestId('prev-slide-btn');
      fireEvent.click(prevBtn);

      await waitFor(() => {
        expect(screen.getByTestId('slide-item-1')).toHaveAttribute('data-current', 'true');
      });
    });
  });

  describe('Fullscreen Mode', () => {
    beforeEach(async () => {
      api.fetchSlides.mockResolvedValue(mockSlides);
    });
    it('should toggle fullscreen mode', async () => {
      render(<App />);
      await waitFor(() => {
        // 直接点击sidebar里的全屏按钮
        const sidebarBtns = screen.getAllByRole('button');
        const fullscreenBtn = sidebarBtns.find(btn => btn.title === 'preview' || btn.title === 'esc');
        fireEvent.click(fullscreenBtn);
      });
      await waitFor(() => {
        expect(screen.getByTestId('slide-preview')).toHaveAttribute('data-fullscreen', 'true');
      });
    });
    it('should show fullscreen preview with correct content', async () => {
      render(<App />);
      await waitFor(() => {
        const sidebarBtns = screen.getAllByRole('button');
        const fullscreenBtn = sidebarBtns.find(btn => btn.title === 'preview' || btn.title === 'esc');
        fireEvent.click(fullscreenBtn);
      });
      await waitFor(() => {
        const preview = screen.getByTestId('slide-preview');
        expect(preview).toHaveAttribute('data-fullscreen', 'true');
        expect(screen.getByTestId('slide-content')).toHaveTextContent('# First Slide');
      });
    });
  });

  describe('Mobile Responsiveness', () => {
    beforeEach(async () => {
      api.fetchSlides.mockResolvedValue(mockSlides);
    });
    it('should detect mobile device', async () => {
      navigator.userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15';
      window.innerWidth = 375;
      render(<App />);
      await waitFor(() => {
        expect(screen.getByTestId('draggable-slide-list')).toBeInTheDocument();
      });
      // 用getAllByText避免重复
      expect(screen.getAllByText('Slides').length).toBeGreaterThan(0);
      expect(screen.getByText('Edit')).toBeInTheDocument();
    });
    it('should handle mobile tab switching', async () => {
      navigator.userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15';
      window.innerWidth = 375;

      render(<App />);
      
      await waitFor(() => {
        expect(screen.getByText('Edit')).toBeInTheDocument();
      });

      const editTab = screen.getByText('Edit');
      fireEvent.click(editTab);

      await waitFor(() => {
        expect(screen.getByTestId('md-editor')).toBeInTheDocument();
      });
    });
  });

  describe('Auto-save Functionality', () => {
    beforeEach(async () => {
      api.fetchSlides.mockResolvedValue(mockSlides);
      api.updateSlide.mockResolvedValue({});
      vi.useFakeTimers();
    });
    afterEach(() => {
      vi.useRealTimers();
    });
    it.skip('should debounce save operations', async () => {
      render(<App />);
      await waitFor(() => {
        expect(screen.getByTestId('md-editor')).toBeInTheDocument();
      });
      const editor = screen.getByTestId('md-editor');
      
      // 直接触发 onChange 事件，模拟用户输入
      await act(async () => {
        fireEvent.change(editor, { target: { value: 'New content' } });
        // 推进定时器
        vi.advanceTimersByTime(500);
        // 运行所有微任务
        await Promise.resolve();
      });
      
      await waitFor(() => {
        expect(api.updateSlide).toHaveBeenCalled();
      }, { timeout: 10000 });
    }, 10000);
  });

  describe('No Slides State', () => {
    it('should show message when no slides are available', async () => {
      api.fetchSlides.mockResolvedValue([]);
      
      render(<App />);
      
      await waitFor(() => {
        expect(screen.getByText('No slides available. Create a new slide to get started.')).toBeInTheDocument();
      });
    });
  });
}); 