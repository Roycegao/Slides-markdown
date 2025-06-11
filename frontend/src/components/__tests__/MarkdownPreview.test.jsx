import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import MarkdownPreview from '../MarkdownPreview';

describe('MarkdownPreview', () => {
  it('renders markdown content', () => {
    const { getByText } = render(<MarkdownPreview content={'# Title\nText'} />);
    expect(getByText('Title')).toBeInTheDocument();
    expect(getByText('Text')).toBeInTheDocument();
  });
  it('renders empty content', () => {
    const { container } = render(<MarkdownPreview content={''} />);
    expect(container.textContent).toBe('');
  });
  it('renders null content', () => {
    const { container } = render(<MarkdownPreview content={null} />);
    expect(container.textContent).toBe('');
  });
  it('renders undefined content', () => {
    const { container } = render(<MarkdownPreview content={undefined} />);
    expect(container.textContent).toBe('');
  });
}); 