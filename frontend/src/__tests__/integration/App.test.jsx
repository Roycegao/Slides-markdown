import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../../App';
import { fetchSlides, createSlide, updateSlide, deleteSlide } from '../../services/api';

// Mock API service
vi.mock('../../services/api', () => ({
  fetchSlides: vi.fn(),
  createSlide: vi.fn(),
  updateSlide: vi.fn(),
  deleteSlide: vi.fn()
}));

describe('App Integration', () => {
  const mockSlides = [
    {
      id: 1,
      order: 1,
      content: '# Slide 1\n\nContent 1',
      layout: 'default',
      metadata: {}
    },
    {
      id: 2,
      order: 2,
      content: '# Slide 2\n\nContent 2',
      layout: 'code',
      metadata: {
        language: 'javascript',
        explanation: 'Code explanation'
      }
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    fetchSlides.mockResolvedValue(mockSlides);
    createSlide.mockImplementation(slide => Promise.resolve({ ...slide, id: Date.now() }));
    updateSlide.mockImplementation((id, slide) => Promise.resolve({ ...slide, id }));
    deleteSlide.mockResolvedValue({});
  });

  it('loads and displays slides', async () => {
    render(<App />);
    
    // Wait for loading to complete
    await waitFor(() => {
      const activeTitle = document.querySelector('.slide-item.active .slide-item-title');
      expect(activeTitle).toHaveTextContent('Slide 1');
    });

    // 也可断言总数
    const allTitles = Array.from(document.querySelectorAll('.slide-item-title'));
    expect(allTitles.length).toBeGreaterThanOrEqual(2);
  });

  it('creates a new slide', async () => {
    render(<App />);
    
    // Wait for initial load
    await waitFor(() => {
      const activeTitle = document.querySelector('.slide-item.active .slide-item-title');
      expect(activeTitle).toHaveTextContent('Slide 1');
    });

    // Click add slide button
    const addButton = screen.getByText('+');
    await userEvent.click(addButton);

    // Verify create request
    expect(createSlide).toHaveBeenCalledWith(expect.objectContaining({
      title: 'New Slide',
      content: expect.stringContaining('New Slide'),
      layout: 'default'
    }));
  });

  it('updates slide content', async () => {
    render(<App />);
    
    // Wait for loading
    await waitFor(() => {
      const activeTitle = document.querySelector('.slide-item.active .slide-item-title');
      expect(activeTitle).toHaveTextContent('Slide 1');
    });

    // Select first slide
    const slide1 = document.querySelectorAll('.slide-item-title')[0];
    await userEvent.click(slide1);

    // Update content
    const editor = screen.getByRole('textbox');
    await userEvent.clear(editor);
    await userEvent.type(editor, '# Updated Slide\n\nNew content');

    // Wait for auto-save
    await waitFor(() => {
      expect(updateSlide).toHaveBeenCalledWith(
        expect.any(Number),
        expect.objectContaining({
          content: '# Updated Slide\n\nNew content'
        })
      );
    });
  });

  it('deletes a slide', async () => {
    render(<App />);
    
    // Wait for loading
    await waitFor(() => {
      const activeTitle = document.querySelector('.slide-item.active .slide-item-title');
      expect(activeTitle).toHaveTextContent('Slide 1');
    });

    // Select first slide
    const slide1 = document.querySelectorAll('.slide-item-title')[0];
    await userEvent.click(slide1);

    // Click delete button
    const deleteButton = screen.getByText('-');
    await userEvent.click(deleteButton);

    // Verify delete request
    expect(deleteSlide).toHaveBeenCalledWith(expect.any(Number));
  });

  it('navigates between slides using keyboard', async () => {
    render(<App />);
    // Wait for loading
    await waitFor(() => {
      const activeTitle = document.querySelector('.slide-item.active .slide-item-title');
      expect(activeTitle).toHaveTextContent('Slide 1');
    });

    // 进入全屏
    const previewButton = screen.getByText('Preview');
    await userEvent.click(previewButton);

    // 用方向键切换
    await userEvent.keyboard('{ArrowRight}');
    await waitFor(() => {
      const h1 = document.querySelector('.content-wrapper h1');
      expect(h1).toBeTruthy();
      expect(h1.textContent).toBe('Slide 2');
    });

    await userEvent.keyboard('{ArrowLeft}');
    await waitFor(() => {
      const h1 = document.querySelector('.content-wrapper h1');
      expect(h1).toBeTruthy();
      expect(h1.textContent).toBe('Slide 1');
    });
  });

  it('toggles fullscreen mode', async () => {
    render(<App />);
    
    // Wait for loading
    await waitFor(() => {
      const activeTitle = document.querySelector('.slide-item.active .slide-item-title');
      expect(activeTitle).toHaveTextContent('Slide 1');
    });

    // Enter fullscreen mode
    const previewButton = screen.getByText('Preview');
    await userEvent.click(previewButton);

    // Verify fullscreen state
    const previewTitle = screen.getByText('Slide 1');
    expect(previewTitle).toBeInTheDocument();
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();

    // Exit fullscreen mode
    fireEvent.keyDown(document, { key: 'Escape' });
    await waitFor(() => {
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });
  });

  it('handles API errors gracefully', async () => {
    // Simulate API error
    fetchSlides.mockRejectedValue(new Error('API Error'));
    
    render(<App />);
    
    // Verify error message
    await waitFor(() => {
      expect(screen.getByText('Error loading slides')).toBeInTheDocument();
    });
  });

  it('maintains slide order after operations', async () => {
    render(<App />);
    
    // Wait for loading
    await waitFor(() => {
      const activeTitle = document.querySelector('.slide-item.active .slide-item-title');
      expect(activeTitle).toHaveTextContent('Slide 1');
    });

    // Create new slide
    const addButton = screen.getByText('+');
    await userEvent.click(addButton);

    // Verify order
    await waitFor(() => {
      const allTitles = Array.from(document.querySelectorAll('.slide-item-title'));
      expect(allTitles[0]).toHaveTextContent('Slide 1');
      expect(allTitles[1]).toHaveTextContent('Slide 2');
      expect(allTitles[2]).toHaveTextContent('New Slide');
    });
  });

  it('preserves slide metadata during updates', async () => {
    render(<App />);
    
    // Wait for loading
    await waitFor(() => {
      const allTitles = Array.from(document.querySelectorAll('.slide-item-title'));
      expect(allTitles[1]).toHaveTextContent('Slide 2');
    });

    // Select code slide
    const codeSlide = document.querySelectorAll('.slide-item-title')[1];
    await userEvent.click(codeSlide);

    // Update content but preserve metadata
    const editor = screen.getByRole('textbox');
    await userEvent.clear(editor);
    await userEvent.type(editor, '# Updated Code Slide\n\nNew code content');

    // Verify update request includes original metadata
    await waitFor(() => {
      expect(updateSlide).toHaveBeenCalledWith(
        expect.any(Number),
        expect.objectContaining({
          content: '# Updated Code Slide\n\nNew code content',
          layout: 'code',
          metadata: {
            language: 'javascript',
            explanation: 'Code explanation'
          }
        })
      );
    });
  });
}); 