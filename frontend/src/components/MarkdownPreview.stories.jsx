import MarkdownPreview from './MarkdownPreview';

export default {
  title: 'Components/MarkdownPreview',
  component: MarkdownPreview,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    content: {
      control: 'text',
      description: 'Markdown content to preview',
    },
  },
};

export const Default = {
  args: {
    content: '# Hello World\n\nThis is a **bold** text and *italic* text.',
  },
};

export const WithCode = {
  args: {
    content: `# Code Example

Here's some JavaScript code:

\`\`\`javascript
function hello() {
  console.log('Hello, World!');
  return 'Hello';
}
\`\`\`

And some inline code: \`const x = 1;\``,
  },
};

export const WithTables = {
  args: {
    content: `# Table Example

| Name | Age | City |
|------|-----|------|
| John | 25  | NYC  |
| Jane | 30  | LA   |
| Bob  | 35  | SF   |

This table shows user information.`,
  },
};

export const WithLists = {
  args: {
    content: `# Lists

## Unordered List
- Item 1
- Item 2
- Item 3

## Ordered List
1. First item
2. Second item
3. Third item

## Nested List
- Parent item
  - Child item 1
  - Child item 2
    - Grandchild item`,
  },
};

export const WithLinks = {
  args: {
    content: `# Links and Images

Visit [Google](https://www.google.com) for search.

![Example Image](https://via.placeholder.com/150)

[GitHub](https://github.com) is a great platform for developers.`,
  },
};

export const ComplexMarkdown = {
  args: {
    content: `# Complex Markdown Example

## Features
- **Bold text** for emphasis
- *Italic text* for subtle emphasis
- \`Inline code\` for technical terms

## Code Examples

### JavaScript
\`\`\`javascript
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n-1) + fibonacci(n-2);
}

console.log(fibonacci(10));
\`\`\`

### Python
\`\`\`python
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

print(fibonacci(10))
\`\`\`

## Blockquote
> This is a blockquote with important information.
> It can span multiple lines.

## Table
| Language | Syntax | Example |
|----------|--------|---------|
| JavaScript | \`function\` | \`function hello() {}\` |
| Python | \`def\` | \`def hello():\` |
| Java | \`public void\` | \`public void hello() {}\` |

## Mixed Content
This paragraph contains **bold text**, *italic text*, and \`inline code\`.

- List item 1
- List item 2 with **bold text**
- List item 3 with [a link](https://example.com)`,
  },
};

export const Empty = {
  args: {
    content: '',
  },
};

export const LongContent = {
  args: {
    content: `# Long Content Example

This is a very long markdown content that should demonstrate how the component handles large amounts of text.

## Section 1
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

## Section 2
Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

## Section 3
Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.

\`\`\`javascript
// This is a long code block
function processData(data) {
  return data.map(item => {
    const processed = {
      id: item.id,
      name: item.name.toUpperCase(),
      value: item.value * 2,
      timestamp: new Date().toISOString()
    };
    
    if (processed.value > 100) {
      processed.category = 'high';
    } else if (processed.value > 50) {
      processed.category = 'medium';
    } else {
      processed.category = 'low';
    }
    
    return processed;
  }).filter(item => item.category !== 'low');
}
\`\`\`

## Final Section
Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.`,
  },
}; 