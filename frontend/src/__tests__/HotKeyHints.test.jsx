import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import HotKeyHints from '../components/HotKeyHints';

describe('HotKeyHints', () => {
  it('should render all hotkey hints', () => {
    render(<HotKeyHints />);
    
    // Check if all hotkey hints are displayed
    expect(screen.getByText('←')).toBeInTheDocument();
    expect(screen.getByText('→')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
    expect(screen.getByText('Esc')).toBeInTheDocument();

    // Check if all descriptions are displayed
    expect(screen.getByText('Previous slide')).toBeInTheDocument();
    expect(screen.getByText('Next slide')).toBeInTheDocument();
    expect(screen.getByText('Delete slide')).toBeInTheDocument();
    expect(screen.getByText('Exit fullscreen')).toBeInTheDocument();
  });

  it('should have correct styling classes', () => {
    const { container } = render(<HotKeyHints />);
    const hintElement = container.firstChild;
    
    expect(hintElement).toHaveClass('hotkey-hint');
  });

  it('should render kbd elements for keys', () => {
    const { container } = render(<HotKeyHints />);
    const kbdElements = container.querySelectorAll('kbd');
    
    expect(kbdElements).toHaveLength(4); // Should have 4 hotkeys
    expect(kbdElements[0]).toHaveTextContent('←');
    expect(kbdElements[1]).toHaveTextContent('→');
    expect(kbdElements[2]).toHaveTextContent('Delete');
    expect(kbdElements[3]).toHaveTextContent('Esc');
  });
}); 