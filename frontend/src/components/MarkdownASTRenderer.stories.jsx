import MarkdownASTRenderer from './MarkdownASTRenderer';

export default {
  title: 'Components/MarkdownASTRenderer',
  component: MarkdownASTRenderer,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    ast: {
      control: 'object',
      description: 'Markdown AST (Abstract Syntax Tree) to render',
    },
  },
};

// Mock AST for different content types
const simpleTextAST = {
  type: 'root',
  children: [
    {
      type: 'paragraph',
      children: [
        {
          type: 'text',
          value: 'This is a simple paragraph with plain text.',
        },
      ],
    },
  ],
};

const headingAST = {
  type: 'root',
  children: [
    {
      type: 'heading',
      depth: 1,
      children: [
        {
          type: 'text',
          value: 'Main Heading',
        },
      ],
    },
    {
      type: 'heading',
      depth: 2,
      children: [
        {
          type: 'text',
          value: 'Sub Heading',
        },
      ],
    },
  ],
};

const formattedTextAST = {
  type: 'root',
  children: [
    {
      type: 'paragraph',
      children: [
        {
          type: 'text',
          value: 'This text contains ',
        },
        {
          type: 'strong',
          children: [
            {
              type: 'text',
              value: 'bold',
            },
          ],
        },
        {
          type: 'text',
          value: ' and ',
        },
        {
          type: 'emphasis',
          children: [
            {
              type: 'text',
              value: 'italic',
            },
          ],
        },
        {
          type: 'text',
          value: ' formatting.',
        },
      ],
    },
  ],
};

const codeBlockAST = {
  type: 'root',
  children: [
    {
      type: 'code_block',
      lang: 'javascript',
      value: `function hello() {
  console.log('Hello, World!');
  return 'Hello';
}`,
    },
  ],
};

const listAST = {
  type: 'root',
  children: [
    {
      type: 'list',
      ordered: false,
      children: [
        {
          type: 'list_item',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  value: 'First item',
                },
              ],
            },
          ],
        },
        {
          type: 'list_item',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  value: 'Second item',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

const complexAST = {
  type: 'root',
  children: [
    {
      type: 'heading',
      depth: 1,
      children: [
        {
          type: 'text',
          value: 'Complex Example',
        },
      ],
    },
    {
      type: 'paragraph',
      children: [
        {
          type: 'text',
          value: 'This is a ',
        },
        {
          type: 'strong',
          children: [
            {
              type: 'text',
              value: 'complex',
            },
          ],
        },
        {
          type: 'text',
          value: ' example with ',
        },
        {
          type: 'emphasis',
          children: [
            {
              type: 'text',
              value: 'mixed',
            },
          ],
        },
        {
          type: 'text',
          value: ' formatting and ',
        },
        {
          type: 'code',
          value: 'inline code',
        },
        {
          type: 'text',
          value: '.',
        },
      ],
    },
    {
      type: 'code_block',
      lang: 'python',
      value: `def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)`,
    },
    {
      type: 'blockquote',
      children: [
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value: 'This is a blockquote with important information.',
            },
          ],
        },
      ],
    },
  ],
};

export const Default = {
  args: {
    ast: simpleTextAST,
  },
};

export const Headings = {
  args: {
    ast: headingAST,
  },
};

export const FormattedText = {
  args: {
    ast: formattedTextAST,
  },
};

export const CodeBlock = {
  args: {
    ast: codeBlockAST,
  },
};

export const List = {
  args: {
    ast: listAST,
  },
};

export const Complex = {
  args: {
    ast: complexAST,
  },
};

export const Empty = {
  args: {
    ast: { type: 'root', children: [] },
  },
}; 