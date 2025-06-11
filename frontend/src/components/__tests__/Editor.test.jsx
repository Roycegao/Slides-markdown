import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import Editor from '../Editor';

// Mock react-markdown-editor-lite
vi.mock('react-markdown-editor-lite', () => ({
  default: ({ value, onChange, ...props }) => {
    return (
      <div className="editor-wrapper">
        <textarea 
          value={value || ''} 
          onChange={(e) => {
            if (onChange) {
              // 模拟真实MdEditor行为，onChange({ text })
              onChange({ text: e.target.value });
            }
          }}
          data-testid="md-editor"
        />
        <div className="render-html" data-testid="render-html">
          {props.renderHTML ? props.renderHTML(value || '') : ''}
        </div>
      </div>
    );
  }
}));

describe('Editor', () => {
  it('renders with value', () => {
    const { getByTestId } = render(<Editor markdown="test" onChange={vi.fn()} />);
    const textarea = getByTestId('md-editor');
    expect(textarea.value).toBe('test');
  });

  it('calls onChange when value changes', () => {
    const mockOnChange = vi.fn();
    const { getByTestId } = render(<Editor markdown="test" onChange={mockOnChange} />);
    const textarea = getByTestId('md-editor');
    
    fireEvent.change(textarea, { target: { value: 'new text' } });
    
    // 断言收到字符串
    expect(mockOnChange).toHaveBeenCalledWith('new text');
  });

  it('renders with empty value', () => {
    const { getByTestId } = render(<Editor markdown="" onChange={vi.fn()} />);
    const textarea = getByTestId('md-editor');
    expect(textarea.value).toBe('');
  });

  it('renders with null value', () => {
    const { getByTestId } = render(<Editor markdown={null} onChange={vi.fn()} />);
    const textarea = getByTestId('md-editor');
    expect(textarea.value).toBe('');
  });

  it('renders with undefined value', () => {
    const { getByTestId } = render(<Editor markdown={undefined} onChange={vi.fn()} />);
    const textarea = getByTestId('md-editor');
    expect(textarea.value).toBe('');
  });

  it('renders HTML preview', () => {
    const { getByTestId } = render(<Editor markdown="# Test" onChange={vi.fn()} />);
    const renderHtml = getByTestId('render-html');
    expect(renderHtml).toBeInTheDocument();
  });
}); 