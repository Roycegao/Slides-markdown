import DraggableSlideList from './DraggableSlideList';

export default {
  title: 'Components/DraggableSlideList',
  component: DraggableSlideList,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    slides: {
      control: 'object',
      description: 'Array of slide objects with id and content',
    },
    currentSlideId: {
      control: 'text',
      description: 'ID of currently selected slide',
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
    currentSlideId: '1',
  },
};

export const SecondSlideSelected = {
  args: {
    slides: mockSlides,
    currentSlideId: '2',
  },
};

export const LastSlideSelected = {
  args: {
    slides: mockSlides,
    currentSlideId: '4',
  },
};

export const SingleSlide = {
  args: {
    slides: [mockSlides[0]],
    currentSlideId: '1',
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
      {
        id: '8',
        content: '# Extra Slide\n\nOne more for good measure.',
      },
    ],
    currentSlideId: '3',
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
      {
        id: '3',
        content: `# Long Title That Might Wrap to Multiple Lines

This is a slide with a very long title that should demonstrate how the component handles text overflow and wrapping in the title area. The title should be properly truncated or wrapped as needed.

## Content
- Item 1
- Item 2
- Item 3`,
      },
    ],
    currentSlideId: '1',
  },
};

export const EmptySlides = {
  args: {
    slides: [],
    currentSlideId: '',
  },
};

export const SlidesWithLongContent = {
  args: {
    slides: [
      {
        id: '1',
        content: `# Short Slide\n\nBrief content.`,
      },
      {
        id: '2',
        content: `# Medium Length Slide\n\nThis slide has a moderate amount of content that should be properly displayed in the preview area. It includes multiple paragraphs and some formatting.`,
      },
      {
        id: '3',
        content: `# Very Long Content Slide\n\nThis slide contains a very large amount of content that should be properly truncated or handled in the preview. It includes multiple sections, code blocks, lists, and other markdown elements that might cause layout issues if not handled correctly. The preview should show only the first few lines or a summary of the content.`,
      },
    ],
    currentSlideId: '2',
  },
}; 