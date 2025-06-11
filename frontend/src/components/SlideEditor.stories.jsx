import SlideEditor from './SlideEditor';

export default {
  title: 'Components/SlideEditor',
  component: SlideEditor,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    slide: {
      control: 'object',
      description: 'Slide object with content, layout, metadata, and order',
    },
    onSave: {
      action: 'save',
      description: 'Callback when slide is saved',
    },
  },
};

const defaultSlide = {
  content: '# Welcome\n\nThis is a sample slide content.',
  layout: 'default',
  metadata: {},
  order: 1,
};

export const Default = {
  args: {
    slide: defaultSlide,
  },
};

export const TitleLayout = {
  args: {
    slide: {
      content: '# Presentation Title\n\n## Subtitle\n\nWelcome to our amazing presentation!',
      layout: 'title',
      metadata: {},
      order: 1,
    },
  },
};

export const CodeLayout = {
  args: {
    slide: {
      content: '```javascript\nfunction hello() {\n  console.log("Hello, World!");\n  return "Hello";\n}\n```',
      layout: 'code',
      metadata: {
        language: 'JavaScript',
        explanation: 'This function prints a greeting message to the console and returns a string.',
      },
      order: 2,
    },
  },
};

export const SplitLayout = {
  args: {
    slide: {
      content: '# Left Side\n\nThis is the left content.\n\n---\n\n# Right Side\n\nThis is the right content.',
      layout: 'split',
      metadata: {
        leftTitle: 'Left Panel',
        rightTitle: 'Right Panel',
      },
      order: 3,
    },
  },
};

export const ImageLayout = {
  args: {
    slide: {
      content: '## About This Image\n\nThis is a sample image with caption.',
      layout: 'image',
      metadata: {
        imageUrl: 'https://via.placeholder.com/800x400',
        caption: 'A placeholder image for demonstration purposes.',
      },
      order: 4,
    },
  },
};

export const ComplexContent = {
  args: {
    slide: {
      content: `# Complex Slide

## Features
- **Bold text** for emphasis
- *Italic text* for subtle emphasis
- \`Inline code\` for technical terms

## Code Example
\`\`\`python
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)
\`\`\`

## Table
| Feature | Status | Priority |
|---------|--------|----------|
| Markdown | ✅ | High |
| Code Highlighting | ✅ | High |
| Multiple Layouts | ✅ | Medium |

> This is a blockquote with important information.`,
      layout: 'default',
      metadata: {},
      order: 5,
    },
  },
};

export const EmptySlide = {
  args: {
    slide: {
      content: '',
      layout: 'default',
      metadata: {},
      order: 6,
    },
  },
};

export const LongContent = {
  args: {
    slide: {
      content: `# Long Content Example

This is a very long markdown content that should demonstrate how the editor handles large amounts of text.

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
      layout: 'default',
      metadata: {},
      order: 7,
    },
  },
}; 