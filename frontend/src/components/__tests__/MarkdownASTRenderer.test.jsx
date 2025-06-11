import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import MarkdownASTRenderer from '../MarkdownASTRenderer';

describe('MarkdownASTRenderer', () => {
  it('renders all node types', () => {
    const ast = {
      type: 'root',
      children: [
        { type: 'heading', depth: 1, children: [{ type: 'text', value: 'Heading' }] },
        { type: 'paragraph', children: [{ type: 'text', value: 'Para' }] },
        { type: 'strong', children: [{ type: 'text', value: 'Bold' }] },
        { type: 'emphasis', children: [{ type: 'text', value: 'Em' }] },
        { type: 'code', value: 'inline' },
        { type: 'codeBlock', value: 'block', lang: 'js' },
        { type: 'list', ordered: false, children: [{ type: 'listItem', children: [{ type: 'text', value: 'Item' }] }] },
        { type: 'link', url: 'url', children: [{ type: 'text', value: 'Link' }] },
        { type: 'image', url: 'img', alt: 'alt' },
        { type: 'blockquote', children: [{ type: 'text', value: 'Quote' }] },
        { type: 'thematicBreak' },
        { type: 'table', children: [{ type: 'tableRow', children: [{ type: 'tableCell', children: [{ type: 'text', value: 'Cell' }] }] }] },
      ]
    };
    const { getByText, getAllByText, getByAltText } = render(<MarkdownASTRenderer ast={ast} />);
    expect(getByText('Heading')).toBeInTheDocument();
    expect(getByText('Para')).toBeInTheDocument();
    expect(getByText('Bold')).toBeInTheDocument();
    expect(getByText('Em')).toBeInTheDocument();
    expect(getByText('inline')).toBeInTheDocument();
    expect(getByText('block')).toBeInTheDocument();
    expect(getByText('Item')).toBeInTheDocument();
    expect(getByText('Link')).toBeInTheDocument();
    expect(getByAltText('alt')).toBeInTheDocument();
    expect(getByText('Quote')).toBeInTheDocument();
    expect(getByText('Cell')).toBeInTheDocument();
    expect(getAllByText('block').length).toBeGreaterThan(0);
  });
  it('handles unknown node type', () => {
    const ast = { type: 'root', children: [{ type: 'unknown' }] };
    const { container } = render(<MarkdownASTRenderer ast={ast} />);
    expect(container).toBeTruthy();
  });
  it('handles codeBlock with unsupported lang', () => {
    const ast = { type: 'codeBlock', value: 'abc', lang: 'notalanguage' };
    const { getByText } = render(<MarkdownASTRenderer ast={ast} />);
    expect(getByText('abc')).toBeInTheDocument();
  });
  it('handles codeBlock with no lang', () => {
    const ast = { type: 'codeBlock', value: 'no lang' };
    const { getByText } = render(<MarkdownASTRenderer ast={ast} />);
    expect(getByText('no lang')).toBeInTheDocument();
  });
  it('handles codeBlock highlight error', () => {
    // mock hljs.highlight 抛异常
    const ast = { type: 'codeBlock', value: 'err', lang: 'javascript' };
    const oldHighlight = require('highlight.js/lib/core').highlight;
    require('highlight.js/lib/core').highlight = () => { throw new Error('fail'); };
    const { getByText } = render(<MarkdownASTRenderer ast={ast} />);
    expect(getByText('err')).toBeInTheDocument();
    require('highlight.js/lib/core').highlight = oldHighlight;
  });
  it('handles null/undefined/empty children in table/tableRow/tableCell', () => {
    const ast = {
      type: 'table',
      children: [
        { type: 'tableRow', children: [
          { type: 'tableCell', children: null },
          { type: 'tableCell', children: undefined },
          { type: 'tableCell', children: [] },
        ] },
        { type: 'tableRow', children: null },
        { type: 'tableRow', children: undefined },
        { type: 'tableRow', children: [] },
      ]
    };
    const { container } = render(<MarkdownASTRenderer ast={ast} />);
    expect(container.querySelectorAll('td').length).toBe(3);
    expect(container.querySelectorAll('tr').length).toBe(4);
  });
  it('handles null node', () => {
    const { container } = render(<MarkdownASTRenderer ast={null} />);
    expect(container).toBeTruthy();
  });
}); 