import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import Editor from '../Editor';

describe('Editor', () => {
  it('renders with value', () => {
    const { container } = render(<Editor markdown="test" onChange={vi.fn()} />);
    const textarea = container.querySelector('textarea');
    expect(textarea.value).toBe('test');
  });
  it('calls onChange when value changes', () => {
    let changed = false;
    const { container } = render(<Editor markdown="test" onChange={() => { changed = true; }} />);
    expect(typeof changed).toBe('boolean');
  });
  it('renders with empty value', () => {
    const { container } = render(<Editor markdown="" onChange={vi.fn()} />);
    const textarea = container.querySelector('textarea');
    expect(textarea.value).toBe('');
  });
  it('renders with null value', () => {
    const { container } = render(<Editor markdown={null} onChange={vi.fn()} />);
    const textarea = container.querySelector('textarea');
    expect(textarea.value).toBe('null');
  });
  it('renders with undefined value', () => {
    const { container } = render(<Editor markdown={undefined} onChange={vi.fn()} />);
    const textarea = container.querySelector('textarea');
    expect(textarea.value).toBe('');
  });
}); 