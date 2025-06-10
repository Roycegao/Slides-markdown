import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import HotKeys from '../components/HotKeys';

describe('HotKeys', () => {
  const handlers = {
    onSave: vi.fn(),
    onAddSlide: vi.fn(),
    onDeleteSlide: vi.fn(),
    onToggleFullscreen: vi.fn(),
    onNextSlide: vi.fn(),
    onPrevSlide: vi.fn(),
  };

  beforeEach(() => {
    Object.values(handlers).forEach(fn => fn.mockClear());
  });

  it('should call onNextSlide when right arrow is pressed', () => {
    render(<HotKeys {...handlers} />);
    fireEvent.keyDown(document, { key: 'ArrowRight' });
    expect(handlers.onNextSlide).toHaveBeenCalledTimes(1);
  });

  it('should call onPrevSlide when left arrow is pressed', () => {
    render(<HotKeys {...handlers} />);
    fireEvent.keyDown(document, { key: 'ArrowLeft' });
    expect(handlers.onPrevSlide).toHaveBeenCalledTimes(1);
  });

  it('should call onSave when Ctrl+S is pressed', () => {
    render(<HotKeys {...handlers} />);
    fireEvent.keyDown(document, { key: 's', ctrlKey: true });
    expect(handlers.onSave).toHaveBeenCalledTimes(1);
  });

  it('should call onAddSlide when Ctrl+N is pressed', () => {
    render(<HotKeys {...handlers} />);
    fireEvent.keyDown(document, { key: 'n', ctrlKey: true });
    expect(handlers.onAddSlide).toHaveBeenCalledTimes(1);
  });

  it('should call onDeleteSlide when Delete is pressed', () => {
    render(<HotKeys {...handlers} />);
    fireEvent.keyDown(document, { key: 'd', ctrlKey: true });
    expect(handlers.onDeleteSlide).toHaveBeenCalledTimes(1);
  });

  it('should call onToggleFullscreen when Escape is pressed', () => {
    render(<HotKeys {...handlers} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(handlers.onToggleFullscreen).toHaveBeenCalledTimes(1);
  });

  it('should not call handlers when keys are pressed in input elements', () => {
    const { container } = render(
      <div>
        <HotKeys {...handlers} />
        <input type="text" />
      </div>
    );
    const input = container.querySelector('input');
    fireEvent.keyDown(input, { key: 'ArrowRight' });
    expect(handlers.onNextSlide).not.toHaveBeenCalled();
  });

  it('should not call handlers when disabled', () => {
    render(<HotKeys {...handlers} disabled={true} />);
    fireEvent.keyDown(document, { key: 'ArrowRight' });
    expect(handlers.onNextSlide).not.toHaveBeenCalled();
    fireEvent.keyDown(document, { key: 'ArrowLeft' });
    expect(handlers.onPrevSlide).not.toHaveBeenCalled();
    fireEvent.keyDown(document, { key: 'd', ctrlKey: true });
    expect(handlers.onDeleteSlide).not.toHaveBeenCalled();
  });
}); 