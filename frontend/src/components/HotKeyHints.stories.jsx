import HotKeyHints from './HotKeyHints';

export default {
  title: 'Components/HotKeyHints',
  component: HotKeyHints,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export const Default = {
  args: {},
};

export const WithCustomStyles = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'HotKeyHints component with default styling showing keyboard shortcuts.',
      },
    },
  },
}; 