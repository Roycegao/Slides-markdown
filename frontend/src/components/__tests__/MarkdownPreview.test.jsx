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
  it('renders inline code', () => {
    const { getByText } = render(<MarkdownPreview content={'This is `inline code` text'} />);
    expect(getByText('inline code')).toBeInTheDocument();
  });
  it('renders code block', () => {
    const { container } = render(<MarkdownPreview content={'```javascript\nconst x = 1;\n```'} />);
    expect(container.textContent).toContain('const');
    expect(container.textContent).toContain('x = 1');
  });
  it('renders table with headers and cells', () => {
    const tableContent = `
| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
`;
    const { getByText } = render(<MarkdownPreview content={tableContent} />);
    expect(getByText('Header 1')).toBeInTheDocument();
    expect(getByText('Header 2')).toBeInTheDocument();
    expect(getByText('Cell 1')).toBeInTheDocument();
    expect(getByText('Cell 2')).toBeInTheDocument();
  });
  it('renders complex markdown with multiple elements', () => {
    const complexContent = `
# Main Title
## Subtitle

This is a **bold** and *italic* text.

- List item 1
- List item 2

\`\`\`javascript
function test() {
  return "hello";
}
\`\`\`

| Name | Age |
|------|-----|
| John | 25  |
| Jane | 30  |

> This is a blockquote
`;

    const { getByText, container } = render(<MarkdownPreview content={complexContent} />);
    
    // Test headings
    expect(getByText('Main Title')).toBeInTheDocument();
    expect(getByText('Subtitle')).toBeInTheDocument();
    
    // Test text formatting
    expect(getByText('bold')).toBeInTheDocument();
    expect(getByText('italic')).toBeInTheDocument();
    
    // Test list
    expect(getByText('List item 1')).toBeInTheDocument();
    expect(getByText('List item 2')).toBeInTheDocument();
    
    // Test code block - use container.textContent for code that gets split by syntax highlighting
    expect(container.textContent).toContain('function');
    expect(container.textContent).toContain('test()');
    expect(container.textContent).toContain('return "hello"');
    
    // Test table
    expect(getByText('Name')).toBeInTheDocument();
    expect(getByText('Age')).toBeInTheDocument();
    expect(getByText('John')).toBeInTheDocument();
    expect(getByText('25')).toBeInTheDocument();
    expect(getByText('Jane')).toBeInTheDocument();
    expect(getByText('30')).toBeInTheDocument();
    
    // Test blockquote
    expect(getByText('This is a blockquote')).toBeInTheDocument();
  });
  it('renders with custom className for code elements', () => {
    const { container } = render(<MarkdownPreview content={'```javascript\nconsole.log("test");\n```'} />);
    const codeElement = container.querySelector('code');
    expect(codeElement).toBeInTheDocument();
  });
  it('renders table with proper styling', () => {
    const { container } = render(<MarkdownPreview content={'| Header |\n|--------|\n| Cell   |'} />);
    const table = container.querySelector('table');
    const th = container.querySelector('th');
    const td = container.querySelector('td');
    
    expect(table).toBeInTheDocument();
    expect(th).toBeInTheDocument();
    expect(td).toBeInTheDocument();
    
    // Check if styling is applied
    expect(table).toHaveStyle('borderCollapse: collapse');
    expect(table).toHaveStyle('width: 100%');
    expect(th).toHaveStyle('border: 1px solid #ccc');
    expect(th).toHaveStyle('padding: 8px');
    expect(th).toHaveStyle('backgroundColor: #f9f9f9');
    expect(td).toHaveStyle('border: 1px solid #ccc');
    expect(td).toHaveStyle('padding: 8px');
  });
  it('renders preview area with correct styling', () => {
    const { container } = render(<MarkdownPreview content={'Test content'} />);
    const previewArea = container.querySelector('.preview-area');
    expect(previewArea).toBeInTheDocument();
    expect(previewArea).toHaveStyle('width: 100%');
  });
  it('handles markdown with special characters', () => {
    const specialContent = `
# Title with **bold** and *italic*
\`\`\`
const special = "!@#$%^&*()";
\`\`\`
| Column | Value |
|--------|-------|
| Test   | Data  |
`;

    const { getByText, container } = render(<MarkdownPreview content={specialContent} />);
    // Use container.textContent for text that gets split by formatting
    expect(container.textContent).toContain('Title with');
    expect(getByText('bold')).toBeInTheDocument();
    expect(getByText('italic')).toBeInTheDocument();
    expect(container.textContent).toContain('const special = "!@#$%^&*()"');
    expect(getByText('Column')).toBeInTheDocument();
    expect(getByText('Value')).toBeInTheDocument();
    expect(getByText('Test')).toBeInTheDocument();
    expect(getByText('Data')).toBeInTheDocument();
  });
  it('renders table with empty children', () => {
    // 直接渲染空表格
    const { container } = render(<MarkdownPreview content={'|  |\n|--|\n|  |'} />);
    const table = container.querySelector('table');
    expect(table).toBeInTheDocument();
  });
  it('renders th and td with null/undefined/empty children', () => {
    // 这里我们用最小表格，children 为空字符串
    const { container } = render(<MarkdownPreview content={'|  |\n|--|\n|  |'} />);
    const th = container.querySelector('th');
    const td = container.querySelector('td');
    expect(th).toBeInTheDocument();
    expect(td).toBeInTheDocument();
    // children 为空的情况
    expect(th.textContent).toBe('');
    expect(td.textContent).toBe('');
  });
  it('renders table with nested elements', () => {
    // 嵌套表格内容
    const content = `| Header |\n|--------|\n| <span>Cell</span> |`;
    const { container } = render(<MarkdownPreview content={content} />);
    const td = container.querySelector('td');
    expect(td).toBeInTheDocument();
  });
}); 