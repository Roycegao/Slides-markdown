import SlidePreview from "../SlidePreview";

export default {
  title: 'Components/SlidePreview',
  component: SlidePreview,
  tags: ['autodocs'],
  argTypes: {
    content: {
      control: 'text',
      description: 'Markdown content to preview',
    },
    theme: {
      control: 'select',
      options: ['light', 'dark'],
      description: 'Preview theme',
    },
    layout: {
      control: 'select',
      options: ['default', 'code', 'split'],
      description: 'Slide layout type',
    },
  },
  parameters: {
    layout: 'fullscreen',
  },
};

// Base story
export const Default = (args) => <SlidePreview {...args} />;
Default.args = { slide: { content: "# Hello, SlidePreview" } };

// Dark theme story
export const DarkTheme = (args) => <SlidePreview {...args} />;
DarkTheme.args = { slide: { content: "# Dark Theme Slide" } };

// Code layout story
export const CodeLayout = (args) => <SlidePreview {...args} />;
CodeLayout.args = { slide: { content: "# Code Layout Slide" } };

// Split layout story
export const SplitLayout = {
  args: {
    content: `# Split Layout Demo

## Left Side
- Point 1
- Point 2
- Point 3

---

## Right Side
- Detail 1
- Detail 2
- Detail 3`,
    theme: 'light',
    layout: 'split',
  },
};

// Complex content story
export const ComplexContent = {
  args: {
    content: `# Complex Slide Preview
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
    theme: 'light',
    layout: 'default',
  },
};

// Responsive story
export const Responsive = {
  args: {
    content: `# Responsive Preview

This slide should adapt to different screen sizes.

## Mobile View
- Optimized for small screens
- Stacked layout
- Readable text

## Desktop View
- Side-by-side layout
- Larger images
- More whitespace`,
    theme: 'light',
    layout: 'default',
  },
  parameters: {
    viewport: {
      defaultViewport: 'responsive',
    },
  },
};

// Animation story
export const WithAnimations = {
  args: {
    content: `# Animated Elements

## Fade In
- Item 1
- Item 2
- Item 3

## Slide In
> Important note with slide effect

## Highlight
\`\`\`javascript
// Code with highlight effect
const highlight = 'This line is highlighted';
\`\`\``,
    theme: 'light',
    layout: 'default',
  },
};

// Custom style story
export const CustomStyles = {
  args: {
    content: `# Custom Styled Slide

## Primary Section
<div class="primary">
  This section has custom styling
</div>

## Secondary Section
<div class="secondary">
  This section has different styling
</div>

<style>
.primary {
  color: #2196f3;
  font-size: 1.2em;
  padding: 1em;
  border-left: 4px solid #2196f3;
}

.secondary {
  color: #4caf50;
  font-size: 1.1em;
  padding: 1em;
  border-left: 4px solid #4caf50;
}
</style>`,
    theme: 'light',
    layout: 'default',
  },
}; 