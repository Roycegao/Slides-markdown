import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import SlidePreview from '../SlidePreview';

describe('SlidePreview', () => {
  it('renders default layout correctly', () => {
    const content = '# Test Slide\n\nThis is a test slide.';
    render(<SlidePreview content={content} layout="default" />);
    
    expect(screen.getByText('Test Slide')).toBeInTheDocument();
    expect(screen.getByText('This is a test slide.')).toBeInTheDocument();
  });

  it('renders title layout correctly', () => {
    const content = '# Title Slide\n\nWelcome to the presentation';
    render(<SlidePreview content={content} layout="title" />);
    
    expect(screen.getByText('Title Slide')).toBeInTheDocument();
    expect(screen.getByText('Welcome to the presentation')).toBeInTheDocument();
  });

  it('renders code layout with syntax highlighting', () => {
    const content = '```javascript\nconst hello = "world";\nconsole.log(hello);\n```';
    const metadata = {
      language: 'javascript',
      explanation: 'This is a simple JavaScript example'
    };
    
    render(<SlidePreview content={content} layout="code" metadata={metadata} />);
    // 检查代码块内容
    const code = document.querySelector('.code-content code');
    expect(code).toBeInTheDocument();
    expect(code.textContent).toContain('const');
    expect(code.textContent).toContain('hello');
    expect(code.textContent).toContain('world');
    // 检查解释
    expect(screen.getByText('This is a simple JavaScript example')).toBeInTheDocument();
  });

  it('renders split layout correctly', () => {
    const content = 'Left Content\n---\nRight Content';
    const metadata = {
      leftTitle: 'Left Section',
      rightTitle: 'Right Section'
    };
    
    render(<SlidePreview content={content} layout="split" metadata={metadata} />);
    
    expect(screen.getByText('Left Section')).toBeInTheDocument();
    expect(screen.getByText('Right Section')).toBeInTheDocument();
    expect(screen.getByText('Left Content')).toBeInTheDocument();
    expect(screen.getByText('Right Content')).toBeInTheDocument();
  });

  it('renders image layout correctly', () => {
    const content = 'Image description';
    const metadata = {
      imageUrl: 'https://example.com/image.jpg',
      caption: 'Image caption'
    };
    
    render(<SlidePreview content={content} layout="image" metadata={metadata} />);
    
    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
    expect(image).toHaveAttribute('alt', 'Image caption');
    expect(screen.getByText('Image caption')).toBeInTheDocument();
    expect(screen.getByText('Image description')).toBeInTheDocument();
  });

  it('handles empty content gracefully', () => {
    render(<SlidePreview content="" layout="default" />);
    const wrapper = document.querySelector('.content-wrapper');
    expect(wrapper).toBeInTheDocument();
    expect(wrapper.textContent).toBe("");
  });

  it('handles markdown formatting correctly', () => {
    const content = '**Bold text** and *italic text*';
    render(<SlidePreview content={content} layout="default" />);
    
    expect(screen.getByText('Bold text')).toHaveStyle('font-weight: bold');
    expect(screen.getByText('italic text')).toHaveStyle('font-style: italic');
  });

  it('renders lists correctly', () => {
    const content = '- Item 1\n- Item 2\n- Item 3';
    render(<SlidePreview content={content} layout="default" />);
    
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
    expect(screen.getByText('Item 3')).toBeInTheDocument();
  });

  it('renders code blocks with language specification', () => {
    const content = '```python\ndef hello():\n    print("Hello, World!")\n```';
    render(<SlidePreview content={content} layout="default" />);
    const code = document.querySelector('.content-wrapper code');
    expect(code).toBeInTheDocument();
    expect(code.textContent).toContain('def');
    expect(code.textContent).toContain('hello');
    expect(code.textContent).toContain('print');
    expect(code.textContent).toContain('Hello, World!');
  });

  it('renders default layout', () => {
    const { getByText } = render(<SlidePreview content={'default'} layout="default" />);
    expect(getByText('default')).toBeInTheDocument();
  });

  it('renders title layout', () => {
    const { getByText } = render(<SlidePreview content={'title'} layout="title" />);
    expect(getByText('title')).toBeInTheDocument();
  });

  it('renders code layout with explanation', () => {
    const { getByText } = render(<SlidePreview content={'console.log(1)'} layout="code" metadata={{ explanation: 'explain', language: 'js' }} />);
    expect(getByText('explain')).toBeInTheDocument();
    expect(getByText('js Code Explanation')).toBeInTheDocument();
  });

  it('renders code layout without explanation', () => {
    const { getByText } = render(<SlidePreview content={'console.log(1)'} layout="code" metadata={{}} />);
    expect(getByText('console.log(1)')).toBeInTheDocument();
  });

  it('renders split layout', () => {
    const { getByText } = render(<SlidePreview content={'left---right'} layout="split" metadata={{ leftTitle: 'L', rightTitle: 'R' }} />);
    expect(getByText('L')).toBeInTheDocument();
    expect(getByText('R')).toBeInTheDocument();
    expect(getByText('left')).toBeInTheDocument();
    expect(getByText('right')).toBeInTheDocument();
  });

  it('renders image layout', () => {
    const { getByAltText, getByText } = render(<SlidePreview content={'img content'} layout="image" metadata={{ imageUrl: 'img.png', caption: 'caption' }} />);
    expect(getByAltText('caption')).toBeInTheDocument();
    expect(getByText('caption')).toBeInTheDocument();
    expect(getByText('img content')).toBeInTheDocument();
  });

  it('renders image layout without imageUrl', () => {
    const { getByText } = render(<SlidePreview content={'img content'} layout="image" metadata={{ caption: 'caption' }} />);
    expect(getByText('caption')).toBeInTheDocument();
    expect(getByText('img content')).toBeInTheDocument();
  });

  it('renders image layout without caption', () => {
    const { getByText } = render(<SlidePreview content={'img content'} layout="image" metadata={{ imageUrl: 'img.png' }} />);
    expect(getByText('img content')).toBeInTheDocument();
  });

  it('renders fullscreen and mobile', () => {
    const { container } = render(<SlidePreview content={'full'} isFullscreen isMobile />);
    expect(container.textContent).toContain('full');
  });

  it('handles unknown layout', () => {
    const { getByText } = render(<SlidePreview content={'unknown'} layout="unknown" />);
    expect(getByText('unknown')).toBeInTheDocument();
  });

  it('renders with metadata null', () => {
    const { getByText } = render(<SlidePreview content={'meta'} layout="default" metadata={null} />);
    expect(getByText('meta')).toBeInTheDocument();
  });
}); 