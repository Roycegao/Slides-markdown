import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import {
  AddIcon,
  RemoveIcon,
  FullscreenIcon,
  FullscreenExitIcon,
  PrevIcon,
  NextIcon,
  UpIcon,
  DownIcon,
  BackIcon,
  CloseIcon
} from '../Icons';

describe('Icons', () => {
  it('renders AddIcon', () => {
    const { container } = render(<AddIcon />);
    expect(container.firstChild).toMatchSnapshot();
  });
  it('renders RemoveIcon', () => {
    const { container } = render(<RemoveIcon />);
    expect(container.firstChild).toMatchSnapshot();
  });
  it('renders FullscreenIcon', () => {
    const { container } = render(<FullscreenIcon />);
    expect(container.firstChild).toMatchSnapshot();
  });
  it('renders FullscreenExitIcon', () => {
    const { container } = render(<FullscreenExitIcon />);
    expect(container.firstChild).toMatchSnapshot();
  });
  it('renders PrevIcon', () => {
    const { container } = render(<PrevIcon />);
    expect(container.firstChild).toMatchSnapshot();
  });
  it('renders NextIcon', () => {
    const { container } = render(<NextIcon />);
    expect(container.firstChild).toMatchSnapshot();
  });
  it('renders UpIcon', () => {
    const { container } = render(<UpIcon />);
    expect(container.firstChild).toMatchSnapshot();
  });
  it('renders DownIcon', () => {
    const { container } = render(<DownIcon />);
    expect(container.firstChild).toMatchSnapshot();
  });
  it('renders BackIcon', () => {
    const { container } = render(<BackIcon />);
    expect(container.firstChild).toMatchSnapshot();
  });
  it('renders CloseIcon', () => {
    const { container } = render(<CloseIcon />);
    expect(container.firstChild).toMatchSnapshot();
  });
}); 