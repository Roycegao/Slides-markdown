import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import HotKeys from '../HotKeys';

describe('HotKeys', () => {
  const mockHandlers = {
    onDeleteSlide: vi.fn(),
    onToggleFullscreen: vi.fn(),
    onNextSlide: vi.fn(),
    onPrevSlide: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls onNextSlide when right arrow is pressed', () => {
    render(<HotKeys {...mockHandlers} />);
    fireEvent.keyDown(document, { key: 'ArrowRight' });
    expect(mockHandlers.onNextSlide).toHaveBeenCalledTimes(1);
  });

  it('calls onPrevSlide when left arrow is pressed', () => {
    render(<HotKeys {...mockHandlers} />);
    fireEvent.keyDown(document, { key: 'ArrowLeft' });
    expect(mockHandlers.onPrevSlide).toHaveBeenCalledTimes(1);
  });

  it('calls onNextSlide when down arrow is pressed', () => {
    render(<HotKeys {...mockHandlers} />);
    fireEvent.keyDown(document, { key: 'ArrowDown' });
    expect(mockHandlers.onNextSlide).toHaveBeenCalledTimes(1);
  });

  it('calls onPrevSlide when up arrow is pressed', () => {
    render(<HotKeys {...mockHandlers} />);
    fireEvent.keyDown(document, { key: 'ArrowUp' });
    expect(mockHandlers.onPrevSlide).toHaveBeenCalledTimes(1);
  });

  it('calls onToggleFullscreen when Escape is pressed', () => {
    render(<HotKeys {...mockHandlers} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(mockHandlers.onToggleFullscreen).toHaveBeenCalledTimes(1);
  });

  it('calls onDeleteSlide when Ctrl+D is pressed', () => {
    render(<HotKeys {...mockHandlers} />);
    fireEvent.keyDown(document, { key: 'd', ctrlKey: true });
    expect(mockHandlers.onDeleteSlide).toHaveBeenCalledTimes(1);
  });

  it('calls onToggleFullscreen when Ctrl+F is pressed', () => {
    render(<HotKeys {...mockHandlers} />);
    fireEvent.keyDown(document, { key: 'f', ctrlKey: true });
    expect(mockHandlers.onToggleFullscreen).toHaveBeenCalledTimes(1);
  });

  it('calls onDeleteSlide when Cmd+D is pressed', () => {
    render(<HotKeys {...mockHandlers} />);
    fireEvent.keyDown(document, { key: 'd', metaKey: true });
    expect(mockHandlers.onDeleteSlide).toHaveBeenCalledTimes(1);
  });

  it('calls onToggleFullscreen when Cmd+F is pressed', () => {
    render(<HotKeys {...mockHandlers} />);
    fireEvent.keyDown(document, { key: 'f', metaKey: true });
    expect(mockHandlers.onToggleFullscreen).toHaveBeenCalledTimes(1);
  });

  it('does not trigger handlers when disabled', () => {
    render(<HotKeys {...mockHandlers} disabled={true} />);
    fireEvent.keyDown(document, { key: 'ArrowRight' });
    fireEvent.keyDown(document, { key: 'ArrowLeft' });
    fireEvent.keyDown(document, { key: 'ArrowDown' });
    fireEvent.keyDown(document, { key: 'ArrowUp' });
    fireEvent.keyDown(document, { key: 'Escape' });
    fireEvent.keyDown(document, { key: 'd', ctrlKey: true });
    fireEvent.keyDown(document, { key: 'f', ctrlKey: true });
    expect(mockHandlers.onNextSlide).not.toHaveBeenCalled();
    expect(mockHandlers.onPrevSlide).not.toHaveBeenCalled();
    expect(mockHandlers.onDeleteSlide).not.toHaveBeenCalled();
    expect(mockHandlers.onToggleFullscreen).not.toHaveBeenCalled();
  });

  it('does not trigger handlers when in input element', () => {
    const { container } = render(
      <div>
        <HotKeys {...mockHandlers} />
        <input type="text" data-testid="test-input" />
      </div>
    );
    const input = container.querySelector('[data-testid="test-input"]');
    input.focus();
    // 确保输入元素被正确识别为可编辑元素
    expect(input.tagName).toBe('INPUT');
    fireEvent.keyDown(input, { key: 'ArrowRight' });
    expect(mockHandlers.onNextSlide).not.toHaveBeenCalled();
  });

  it('does not trigger handlers when in textarea element', () => {
    const { container } = render(
      <div>
        <HotKeys {...mockHandlers} />
        <textarea data-testid="test-textarea" />
      </div>
    );
    const textarea = container.querySelector('[data-testid="test-textarea"]');
    textarea.focus();
    fireEvent.keyDown(textarea, { key: 'ArrowRight' });
    expect(mockHandlers.onNextSlide).not.toHaveBeenCalled();
  });

  it('does not trigger handlers when in select element', () => {
    const { container } = render(
      <div>
        <HotKeys {...mockHandlers} />
        <select data-testid="test-select">
          <option>Option 1</option>
        </select>
      </div>
    );
    const select = container.querySelector('[data-testid="test-select"]');
    select.focus();
    fireEvent.keyDown(select, { key: 'ArrowRight' });
    expect(mockHandlers.onNextSlide).not.toHaveBeenCalled();
  });

  it('does not trigger handlers when in markdown editor', () => {
    const { container } = render(
      <div>
        <HotKeys {...mockHandlers} />
        <div className="w-md-editor">
          <div className="w-md-editor-text-input">
            <textarea data-testid="md-textarea" />
          </div>
        </div>
      </div>
    );
    const textarea = container.querySelector('[data-testid="md-textarea"]');
    textarea.focus();
    fireEvent.keyDown(textarea, { key: 'ArrowRight' });
    expect(mockHandlers.onNextSlide).not.toHaveBeenCalled();
  });

  it('does not trigger handlers when in markdown editor content', () => {
    const { container } = render(
      <div>
        <HotKeys {...mockHandlers} />
        <div className="w-md-editor-content">
          <div data-testid="md-content">Content</div>
        </div>
      </div>
    );
    const content = container.querySelector('[data-testid="md-content"]');
    content.focus();
    fireEvent.keyDown(content, { key: 'ArrowRight' });
    expect(mockHandlers.onNextSlide).not.toHaveBeenCalled();
  });

  it('does not trigger handlers when in nested markdown editor', () => {
    const { container } = render(
      <div>
        <HotKeys {...mockHandlers} />
        <div>
          <div className="w-md-editor">
            <div data-testid="nested-content">Nested content</div>
          </div>
        </div>
      </div>
    );
    const nested = container.querySelector('[data-testid="nested-content"]');
    nested.focus();
    fireEvent.keyDown(nested, { key: 'ArrowRight' });
    expect(mockHandlers.onNextSlide).not.toHaveBeenCalled();
  });

  it('ignores other Ctrl/Cmd key combinations', () => {
    render(<HotKeys {...mockHandlers} />);
    fireEvent.keyDown(document, { key: 's', ctrlKey: true });
    fireEvent.keyDown(document, { key: 'a', ctrlKey: true });
    fireEvent.keyDown(document, { key: 'c', ctrlKey: true });
    expect(mockHandlers.onDeleteSlide).not.toHaveBeenCalled();
    expect(mockHandlers.onToggleFullscreen).not.toHaveBeenCalled();
  });

  it('updates disabled state when prop changes', () => {
    const { rerender } = render(<HotKeys {...mockHandlers} disabled={false} />);
    
    // 初始状态应该可以触发
    fireEvent.keyDown(document, { key: 'ArrowRight' });
    expect(mockHandlers.onNextSlide).toHaveBeenCalledTimes(1);
    
    // 重新渲染为disabled
    rerender(<HotKeys {...mockHandlers} disabled={true} />);
    fireEvent.keyDown(document, { key: 'ArrowRight' });
    expect(mockHandlers.onNextSlide).toHaveBeenCalledTimes(1); // 仍然是1次，没有增加
  });
}); 