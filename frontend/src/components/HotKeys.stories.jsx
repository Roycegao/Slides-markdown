import HotKeys from './HotKeys';

export default {
  title: 'Components/HotKeys',
  component: HotKeys,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onDeleteSlide: {
      action: 'delete slide',
      description: 'Callback when delete slide is triggered',
    },
    onToggleFullscreen: {
      action: 'toggle fullscreen',
      description: 'Callback when fullscreen is toggled',
    },
    onNextSlide: {
      action: 'next slide',
      description: 'Callback when next slide is triggered',
    },
    onPrevSlide: {
      action: 'prev slide',
      description: 'Callback when previous slide is triggered',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether hotkeys are disabled',
    },
  },
};

export const Default = {
  args: {
    disabled: false,
  },
};

export const Disabled = {
  args: {
    disabled: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'HotKeys component with disabled state - no keyboard events will be processed.',
      },
    },
  },
};

export const WithAllCallbacks = {
  args: {
    disabled: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'HotKeys component with all callback functions. Try pressing arrow keys, Escape, Ctrl+D, or Ctrl+F to see the actions.',
      },
    },
  },
}; 