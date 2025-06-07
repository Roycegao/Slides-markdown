import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import HotKeys from '../components/HotKeys';

describe('HotKeys', () => {
  const mockHandlers = {
    onNext: vi.fn(),
    onPrev: vi.fn(),
    onSave: vi.fn(),
    onNew: vi.fn(),
    onDelete: vi.fn(),
    onToggleFullscreen: vi.fn(),
  };

  it('should call onNext when right arrow is pressed', () => {
    render(<HotKeys {...mockHandlers} canNext={true} />);
    fireEvent.keyDown(document, { key: 'ArrowRight' });
    expect(mockHandlers.onNext).toHaveBeenCalledTimes(1);
  });

  it('should call onPrev when left arrow is pressed', () => {
    render(<HotKeys {...mockHandlers} canPrev={true} />);
    fireEvent.keyDown(document, { key: 'ArrowLeft' });
    expect(mockHandlers.onPrev).toHaveBeenCalledTimes(1);
  });

  it('should call onSave when Ctrl+S is pressed', () => {
    render(<HotKeys {...mockHandlers} />);
    fireEvent.keyDown(document, { key: 's', ctrlKey: true });
    expect(mockHandlers.onSave).toHaveBeenCalledTimes(1);
  });

  it('should call onNew when Ctrl+N is pressed', () => {
    render(<HotKeys {...mockHandlers} />);
    fireEvent.keyDown(document, { key: 'n', ctrlKey: true });
    expect(mockHandlers.onNew).toHaveBeenCalledTimes(1);
  });

  it('should call onDelete when Delete is pressed', () => {
    render(<HotKeys {...mockHandlers} canDelete={true} />);
    fireEvent.keyDown(document, { key: 'Delete' });
    expect(mockHandlers.onDelete).toHaveBeenCalledTimes(1);
  });

  it('should call onToggleFullscreen when Escape is pressed', () => {
    render(<HotKeys {...mockHandlers} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(mockHandlers.onToggleFullscreen).toHaveBeenCalledTimes(1);
  });

  it('should not call handlers when keys are pressed in input elements', () => {
    const { container } = render(
      <div>
        <HotKeys {...mockHandlers} />
        <input type="text" />
      </div>
    );
    
    const input = container.querySelector('input');
    fireEvent.keyDown(input, { key: 'ArrowRight' });
    expect(mockHandlers.onNext).not.toHaveBeenCalled();
  });

  it('should not call handlers when disabled', () => {
    render(<HotKeys {...mockHandlers} canNext={false} canPrev={false} canDelete={false} />);
    
    fireEvent.keyDown(document, { key: 'ArrowRight' });
    expect(mockHandlers.onNext).not.toHaveBeenCalled();
    
    fireEvent.keyDown(document, { key: 'ArrowLeft' });
    expect(mockHandlers.onPrev).not.toHaveBeenCalled();
    
    fireEvent.keyDown(document, { key: 'Delete' });
    expect(mockHandlers.onDelete).not.toHaveBeenCalled();
  });
}); 