import Sidebar from './Sidebar';

export default {
  title: 'Components/Sidebar',
  component: Sidebar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    slides: {
      control: 'object',
      description: 'Array of slide objects with id and content',
    },
    currentIndex: {
      control: { type: 'number', min: 0 },
      description: 'Index of currently selected slide',
    },
    onSelect: {
      action: 'slide selected',
      description: 'Callback when a slide is selected',
    },
  },
};

const mockSlides = [
  {
    id: '1',
    content: '# Introduction\n\nWelcome to our presentation!',
  },
  {
    id: '2',
    content: '# Getting Started\n\nLet\'s begin with the basics.',
  },
  {
    id: '3',
    content: '# Advanced Topics\n\nNow let\'s dive deeper.',
  },
  {
    id: '4',
    content: '# Conclusion\n\nThank you for your attention!',
  },
];

export const Default = {
  args: {
    slides: mockSlides,
    currentIndex: 0,
  },
};

export const SecondSlideSelected = {
  args: {
    slides: mockSlides,
    currentIndex: 1,
  },
};

export const LastSlideSelected = {
  args: {
    slides: mockSlides,
    currentIndex: 3,
  },
};

export const SingleSlide = {
  args: {
    slides: [mockSlides[0]],
    currentIndex: 0,
  },
};

export const ManySlides = {
  args: {
    slides: [
      ...mockSlides,
      {
        id: '5',
        content: '# Additional Content\n\nMore slides for testing.',
      },
      {
        id: '6',
        content: '# Even More\n\nTesting with many slides.',
      },
      {
        id: '7',
        content: '# Final Slide\n\nThis is the end.',
      },
    ],
    currentIndex: 2,
  },
};

export const ComplexContent = {
  args: {
    slides: [
      {
        id: '1',
        content: `# Complex Slide

## Features
- **Bold text**
- *Italic text*
- \`Code snippets\`

## Code Example
\`\`\`javascript
function example() {
  return "Hello World";
}
\`\`\`

> This is a blockquote`,
      },
      {
        id: '2',
        content: `# Another Complex Slide

| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Data 1   | Data 2   | Data 3   |
| Data 4   | Data 5   | Data 6   |

[Link to example](https://example.com)`,
      },
    ],
    currentIndex: 0,
  },
}; 