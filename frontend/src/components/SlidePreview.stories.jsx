import SlidePreview from './SlidePreview';

export default {
  title: 'Components/SlidePreview',
  component: SlidePreview,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    content: {
      control: 'text',
      description: 'Markdown content for the slide',
    },
    layout: {
      control: { type: 'select' },
      options: ['default', 'title', 'code', 'split', 'image'],
      description: 'Layout type for the slide',
    },
    metadata: {
      control: 'object',
      description: 'Additional metadata for the slide',
    },
    currentIndex: {
      control: { type: 'number', min: 0 },
      description: 'Current slide index',
    },
    totalSlides: {
      control: { type: 'number', min: 0 },
      description: 'Total number of slides',
    },
    isFullscreen: {
      control: 'boolean',
      description: 'Whether the slide is in fullscreen mode',
    },
    isMobile: {
      control: 'boolean',
      description: 'Whether the slide is viewed on mobile',
    },
  },
};

export const Default = {
  args: {
    content: '# Welcome\n\nThis is a default slide layout.',
    layout: 'default',
    currentIndex: 0,
    totalSlides: 5,
    isFullscreen: false,
    isMobile: false,
  },
};

export const TitleLayout = {
  args: {
    content: '# Presentation Title\n\n## Subtitle\n\nWelcome to our amazing presentation!',
    layout: 'title',
    currentIndex: 0,
    totalSlides: 5,
    isFullscreen: false,
    isMobile: false,
  },
};

export const CodeLayout = {
  args: {
    content: '```javascript\nfunction hello() {\n  console.log("Hello, World!");\n  return "Hello";\n}\n```',
    layout: 'code',
    metadata: {
      language: 'JavaScript',
      explanation: 'This function prints a greeting message to the console and returns a string.',
    },
    currentIndex: 1,
    totalSlides: 5,
    isFullscreen: false,
    isMobile: false,
  },
};

export const SplitLayout = {
  args: {
    content: '# Left Side\n\nThis is the left content.\n\n---\n\n# Right Side\n\nThis is the right content.',
    layout: 'split',
    metadata: {
      leftTitle: 'Left Panel',
      rightTitle: 'Right Panel',
    },
    currentIndex: 2,
    totalSlides: 5,
    isFullscreen: false,
    isMobile: false,
  },
};

export const ImageLayout = {
  args: {
    content: '## About This Image\n\nThis is a sample image with caption.',
    layout: 'image',
    metadata: {
      imageUrl: 'https://via.placeholder.com/800x400',
      caption: 'A placeholder image for demonstration purposes.',
    },
    currentIndex: 3,
    totalSlides: 5,
    isFullscreen: false,
    isMobile: false,
  },
};

export const Fullscreen = {
  args: {
    content: '# Fullscreen Mode\n\nThis slide is displayed in fullscreen mode.',
    layout: 'default',
    currentIndex: 4,
    totalSlides: 5,
    isFullscreen: true,
    isMobile: false,
  },
};

export const ComplexContent = {
  args: {
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
    currentIndex: 2,
    totalSlides: 10,
    isFullscreen: false,
    isMobile: false,
  },
};

export const MobileView = {
  args: {
    content: '# Mobile View\n\nThis slide is optimized for mobile devices.',
    layout: 'default',
    currentIndex: 1,
    totalSlides: 3,
    isFullscreen: false,
    isMobile: true,
  },
};

export const EmptyContent = {
  args: {
    content: '',
    layout: 'default',
    currentIndex: 0,
    totalSlides: 1,
    isFullscreen: false,
    isMobile: false,
  },
}; 