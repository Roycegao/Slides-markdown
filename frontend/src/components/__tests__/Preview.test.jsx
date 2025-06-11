import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import Preview from '../Preview';

describe('Preview', () => {
  it('renders markdown', () => {
    const { container } = render(<Preview markdown={'hello'} />);
    expect(container.textContent).toContain('hello');
  });
}); 