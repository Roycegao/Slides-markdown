import Preview from './Preview';

export default {
  title: 'Components/Preview',
  component: Preview,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    markdown: {
      control: 'text',
      description: 'Markdown content to preview',
    },
  },
};

export const Default = {
  args: {
    markdown: '# Hello World\n\nThis is a **bold** text and *italic* text.',
  },
};

export const WithCode = {
  args: {
    markdown: `# Code Example

Here's some JavaScript code:

\`\`\`javascript
function hello() {
  console.log('Hello, World!');
}
\`\`\`

And some inline code: \`const x = 1;\``,
  },
};

export const WithLists = {
  args: {
    markdown: `# Lists

## Unordered List
- Item 1
- Item 2
- Item 3

## Ordered List
1. First item
2. Second item
3. Third item`,
  },
};

export const WithLinks = {
  args: {
    markdown: `# Links and Images

Visit [Google](https://www.google.com) for search.

![Example Image](https://via.placeholder.com/150)`,
  },
};

export const ComplexMarkdown = {
  args: {
    markdown: `# Complex Markdown Example

## Table
| Name | Age | City |
|------|-----|------|
| John | 25  | NYC  |
| Jane | 30  | LA   |

## Blockquote
> This is a blockquote
> It can span multiple lines

## Code with syntax highlighting
\`\`\`python
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)
\`\`\`

## Mixed content
This paragraph contains **bold text**, *italic text*, and \`inline code\`.

- List item 1
- List item 2 with **bold text**
- List item 3`,
  },
}; 