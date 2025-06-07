import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SlideEditor from '../SlideEditor';

describe('SlideEditor', () => {
  const mockSlide = {
    id: 1,
    order: 1,
    content: '# Test Slide\n\nThis is a test slide.',
    layout: 'default',
    metadata: {}
  };

  const mockOnSave = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with initial slide data', () => {
    render(<SlideEditor slide={mockSlide} onSave={mockOnSave} />);
    
    expect(screen.getByText('Edit Slide (Order: 1)')).toBeInTheDocument();
    expect(screen.getByDisplayValue('# Test Slide\n\nThis is a test slide.')).toBeInTheDocument();
    expect(screen.getByDisplayValue('default')).toBeInTheDocument();
  });

  it('calls onSave with updated content when save button is clicked', () => {
    render(<SlideEditor slide={mockSlide} onSave={mockOnSave} />);
    
    const contentTextarea = screen.getByPlaceholderText('Write your slide content in Markdown...');
    fireEvent.change(contentTextarea, {
      target: { value: '# Updated Slide\n\nNew content' }
    });
    
    const saveButton = screen.getByText('Save Changes');
    fireEvent.click(saveButton);
    
    expect(mockOnSave).toHaveBeenCalledWith({
      content: '# Updated Slide\n\nNew content',
      layout: 'default',
      metadata: {}
    });
  });

  it('updates layout when layout is changed', () => {
    render(<SlideEditor slide={mockSlide} onSave={mockOnSave} />);
    
    const layoutSelect = screen.getByLabelText('Layout:');
    fireEvent.change(layoutSelect, { target: { value: 'code' } });
    
    const saveButton = screen.getByText('Save Changes');
    fireEvent.click(saveButton);
    
    expect(mockOnSave).toHaveBeenCalledWith({
      content: mockSlide.content,
      layout: 'code',
      metadata: {}
    });
  });

  it('renders metadata fields for code layout', () => {
    const codeSlide = {
      ...mockSlide,
      layout: 'code',
      metadata: {
        language: 'javascript',
        explanation: 'Code explanation'
      }
    };
    
    render(<SlideEditor slide={codeSlide} onSave={mockOnSave} />);
    
    expect(screen.getByLabelText('Code Language:')).toBeInTheDocument();
    expect(screen.getByLabelText('Explanation:')).toBeInTheDocument();
    expect(screen.getByDisplayValue('javascript')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Code explanation')).toBeInTheDocument();
  });

  it('renders metadata fields for split layout', () => {
    const splitSlide = {
      ...mockSlide,
      layout: 'split',
      metadata: {
        leftTitle: 'Left Title',
        rightTitle: 'Right Title'
      }
    };
    
    render(<SlideEditor slide={splitSlide} onSave={mockOnSave} />);
    
    expect(screen.getByLabelText('Left Title:')).toBeInTheDocument();
    expect(screen.getByLabelText('Right Title:')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Left Title')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Right Title')).toBeInTheDocument();
  });

  it('renders metadata fields for image layout', () => {
    const imageSlide = {
      ...mockSlide,
      layout: 'image',
      metadata: {
        imageUrl: 'https://example.com/image.jpg',
        caption: 'Image caption'
      }
    };
    
    render(<SlideEditor slide={imageSlide} onSave={mockOnSave} />);
    
    expect(screen.getByLabelText('Image URL:')).toBeInTheDocument();
    expect(screen.getByLabelText('Caption:')).toBeInTheDocument();
    expect(screen.getByDisplayValue('https://example.com/image.jpg')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Image caption')).toBeInTheDocument();
  });

  it('updates metadata when metadata fields are changed', () => {
    const codeSlide = {
      ...mockSlide,
      layout: 'code',
      metadata: {
        language: 'javascript',
        explanation: 'Code explanation'
      }
    };
    
    render(<SlideEditor slide={codeSlide} onSave={mockOnSave} />);
    
    const languageInput = screen.getByLabelText('Code Language:');
    const explanationInput = screen.getByLabelText('Explanation:');
    
    fireEvent.change(languageInput, { target: { value: 'python' } });
    fireEvent.change(explanationInput, { target: { value: 'Updated explanation' } });
    
    const saveButton = screen.getByText('Save Changes');
    fireEvent.click(saveButton);
    
    expect(mockOnSave).toHaveBeenCalledWith({
      content: codeSlide.content,
      layout: 'code',
      metadata: {
        language: 'python',
        explanation: 'Updated explanation'
      }
    });
  });

  it('handles empty metadata gracefully', () => {
    const slideWithEmptyMetadata = {
      ...mockSlide,
      metadata: null
    };
    
    render(<SlideEditor slide={slideWithEmptyMetadata} onSave={mockOnSave} />);
    
    const saveButton = screen.getByText('Save Changes');
    fireEvent.click(saveButton);
    
    expect(mockOnSave).toHaveBeenCalledWith({
      content: mockSlide.content,
      layout: 'default',
      metadata: {}
    });
  });
}); 