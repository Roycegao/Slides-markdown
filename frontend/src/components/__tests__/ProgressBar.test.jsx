import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import ProgressBar from '../ProgressBar';

describe('ProgressBar', () => {
  it('renders with correct width and content', () => {
    const { container, getByText } = render(<ProgressBar current={5} total={10} onNext={() => {}} onPrev={() => {}} />);
    const bar = container.querySelector('div > div > div > div');
    expect(bar.style.width).toBe('50%');
    expect(getByText('5 / 10')).toBeInTheDocument();
  });
  it('renders with current=0', () => {
    const { container } = render(<ProgressBar current={0} total={10} onNext={() => {}} onPrev={() => {}} />);
    const bar = container.querySelector('div > div > div > div');
    expect(bar.style.width).toBe('0%');
  });
  it('renders with total=0', () => {
    const { container } = render(<ProgressBar current={5} total={0} onNext={() => {}} onPrev={() => {}} />);
    const bar = container.querySelector('div > div > div > div');
    expect(bar.style.width).toBe('');
  });
}); 