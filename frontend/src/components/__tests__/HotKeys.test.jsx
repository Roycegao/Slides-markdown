import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import HotKeys from '../HotKeys';

describe('HotKeys', () => {
  const mockHandlers = {
    onSave: vi.fn(),
    onAddSlide: vi.fn(),
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

  it('calls onSave when Ctrl+S is pressed', () => {
    render(<HotKeys {...mockHandlers} />);
    fireEvent.keyDown(document, { key: 's', ctrlKey: true });
    expect(mockHandlers.onSave).toHaveBeenCalledTimes(1);
  });

  it('calls onAddSlide when Ctrl+N is pressed', () => {
    render(<HotKeys {...mockHandlers} />);
    fireEvent.keyDown(document, { key: 'n', ctrlKey: true });
    expect(mockHandlers.onAddSlide).toHaveBeenCalledTimes(1);
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

  it('does not trigger handlers when disabled', () => {
    render(<HotKeys {...mockHandlers} disabled={true} />);
    fireEvent.keyDown(document, { key: 'ArrowRight' });
    fireEvent.keyDown(document, { key: 'ArrowLeft' });
    fireEvent.keyDown(document, { key: 'ArrowDown' });
    fireEvent.keyDown(document, { key: 'ArrowUp' });
    fireEvent.keyDown(document, { key: 'Escape' });
    fireEvent.keyDown(document, { key: 's', ctrlKey: true });
    fireEvent.keyDown(document, { key: 'n', ctrlKey: true });
    fireEvent.keyDown(document, { key: 'd', ctrlKey: true });
    fireEvent.keyDown(document, { key: 'f', ctrlKey: true });
    expect(mockHandlers.onNextSlide).not.toHaveBeenCalled();
    expect(mockHandlers.onPrevSlide).not.toHaveBeenCalled();
    expect(mockHandlers.onAddSlide).not.toHaveBeenCalled();
    expect(mockHandlers.onDeleteSlide).not.toHaveBeenCalled();
    expect(mockHandlers.onToggleFullscreen).not.toHaveBeenCalled();
    expect(mockHandlers.onSave).not.toHaveBeenCalled();
  });

  it.skip('does not trigger handlers when in editable element', () => {
    const { container } = render(
      <div>
        <HotKeys {...mockHandlers} />
        <input type="text" />
      </div>
    );
    const input = container.querySelector('input');
    input.focus();
    fireEvent.keyDown(input, { key: 'ArrowRight' });
    fireEvent.keyDown(input, { key: 'ArrowLeft' });
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'ArrowUp' });
    fireEvent.keyDown(input, { key: 'Escape' });
    fireEvent.keyDown(input, { key: 's', ctrlKey: true });
    fireEvent.keyDown(input, { key: 'n', ctrlKey: true });
    fireEvent.keyDown(input, { key: 'd', ctrlKey: true });
    fireEvent.keyDown(input, { key: 'f', ctrlKey: true });
    expect(mockHandlers.onNextSlide).not.toHaveBeenCalled();
    expect(mockHandlers.onPrevSlide).not.toHaveBeenCalled();
    expect(mockHandlers.onAddSlide).not.toHaveBeenCalled();
    expect(mockHandlers.onDeleteSlide).not.toHaveBeenCalled();
    expect(mockHandlers.onToggleFullscreen).not.toHaveBeenCalled();
    expect(mockHandlers.onSave).not.toHaveBeenCalled();
  });

  it('handles meta key (Command) on Mac', () => {
    render(<HotKeys {...mockHandlers} />);
    
    // Simulate Mac Command key
    fireEvent.keyDown(document, { key: 's', metaKey: true });
    expect(mockHandlers.onSave).toHaveBeenCalledTimes(1);
  });
}); 