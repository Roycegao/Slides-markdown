import SlideEditor from '../SlideEditor';

export default {
  title: 'Components/SlideEditor',
  component: SlideEditor,
  tags: ['autodocs'],
  argTypes: {
    content: {
      control: 'text',
      description: 'Markdown content of the slide',
    },
    onChange: {
      action: 'changed',
      description: 'Callback when content changes',
    },
    onSave: {
      action: 'saved',
      description: 'Callback when save is triggered',
    },
  },
};

// Base story
export const Default = {
  args: {
    content: '# Welcome\n\nThis is a sample slide.',
  },
};

// Empty editor story
export const Empty = {
  args: {
    content: '',
  },
};

// Complex content story
export const ComplexContent = {
  args: {
    content: `# Complex Slide
## With Multiple Sections

- List item 1
- List item 2
- List item 3

\`\`\`javascript
const code = 'example';
console.log(code);
\`\`\`

> Blockquote with some text

[Link](https://example.com)

**Bold text** and *italic text*`,
  },
};

// Code focus story
export const CodeHighlight = {
  args: {
    content: `# Code Highlight Demo

\`\`\`javascript
function example() {
  const message = 'Hello, World!';
  console.log(message);
  return message;
}
\`\`\`

\`\`\`python
def example():
    message = "Hello, World!"
    print(message)
    return message
\`\`\`

\`\`\`css
.example {
  color: #ff0000;
  font-size: 16px;
  margin: 10px;
}
\`\`\``,
  },
};

// Table story
export const WithTable = {
  args: {
    content: `# Table Example

| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |
| Cell 7   | Cell 8   | Cell 9   |`,
  },
};

// Image story
export const WithImages = {
  args: {
    content: `# Image Example

![Sample Image](https://via.placeholder.com/400x300)

> Image caption with description`,
  },
};

// Math formula story
export const WithMath = {
  args: {
    content: `# Math Formula Example

Inline math: $E = mc^2$

Block math:

$$
\\frac{d}{dx}(x^n) = nx^{n-1}
$$

$$
\\int_{a}^{b} f(x) dx = F(b) - F(a)
$$`,
  },
}; 