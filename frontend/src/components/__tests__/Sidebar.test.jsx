import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import Sidebar from '../Sidebar';

describe('Sidebar', () => {
  it('renders slides and handles select', () => {
    const slides = [
      { id: 1, content: '# Slide 1' },
      { id: 2, content: '# Slide 2' }
    ];
    const onSelect = vi.fn();
    const { getByText } = render(<Sidebar slides={slides} currentIndex={0} onSelect={onSelect} />);
    expect(getByText('Slide 1')).toBeInTheDocument();
    expect(getByText('Slide 2')).toBeInTheDocument();
    getByText('Slide 2').click();
    expect(onSelect).toHaveBeenCalled();
  });
  it('renders with empty slides', () => {
    const { container } = render(<Sidebar slides={[]} currentIndex={0} onSelect={() => {}} />);
    expect(container).toBeTruthy();
  });
}); 