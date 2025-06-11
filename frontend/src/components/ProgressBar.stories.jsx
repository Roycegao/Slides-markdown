import ProgressBar from './ProgressBar';

export default {
  title: 'Components/ProgressBar',
  component: ProgressBar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    current: {
      control: { type: 'number', min: 1 },
      description: 'Current slide number',
    },
    total: {
      control: { type: 'number', min: 1 },
      description: 'Total number of slides',
    },
    onNext: {
      action: 'next clicked',
      description: 'Callback when next button is clicked',
    },
    onPrev: {
      action: 'prev clicked',
      description: 'Callback when previous button is clicked',
    },
  },
};

export const Default = {
  args: {
    current: 1,
    total: 5,
  },
};

export const Middle = {
  args: {
    current: 3,
    total: 5,
  },
};

export const Last = {
  args: {
    current: 5,
    total: 5,
  },
};

export const SingleSlide = {
  args: {
    current: 1,
    total: 1,
  },
};

export const ManySlides = {
  args: {
    current: 15,
    total: 25,
  },
};

export const FirstSlide = {
  args: {
    current: 1,
    total: 10,
  },
  parameters: {
    docs: {
      description: {
        story: 'Progress bar showing the first slide - prev button should be disabled.',
      },
    },
  },
};

export const LastSlide = {
  args: {
    current: 10,
    total: 10,
  },
  parameters: {
    docs: {
      description: {
        story: 'Progress bar showing the last slide - next button should be disabled.',
      },
    },
  },
}; 