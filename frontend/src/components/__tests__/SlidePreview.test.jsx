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

  it('renders code layout without explanation when explanation is falsy', () => {
    const { getByText } = render(<SlidePreview content={'code'} layout="code" metadata={{ explanation: '' }} />);
    expect(getByText('code')).toBeInTheDocument();
    // 不应该显示解释部分
    expect(() => screen.getByText('Code Explanation')).toThrow();
  });

  it('renders code layout without explanation when explanation is null', () => {
    const { getByText } = render(<SlidePreview content={'code'} layout="code" metadata={{ explanation: null }} />);
    expect(getByText('code')).toBeInTheDocument();
    // 不应该显示解释部分
    expect(() => screen.getByText('Code Explanation')).toThrow();
  });

  it('renders code layout with explanation but no language', () => {
    const { getByText } = render(<SlidePreview content={'code'} layout="code" metadata={{ explanation: 'explain', language: '' }} />);
    expect(getByText('explain')).toBeInTheDocument();
    expect(getByText('Code Explanation')).toBeInTheDocument();
  });

  it('renders code layout with explanation but language is null', () => {
    const { getByText } = render(<SlidePreview content={'code'} layout="code" metadata={{ explanation: 'explain', language: null }} />);
    expect(getByText('explain')).toBeInTheDocument();
    expect(getByText('Code Explanation')).toBeInTheDocument();
  });

  it('renders split layout without leftTitle', () => {
    const { getByText } = render(<SlidePreview content={'left---right'} layout="split" metadata={{ rightTitle: 'R' }} />);
    expect(getByText('R')).toBeInTheDocument();
    expect(getByText('left')).toBeInTheDocument();
    expect(getByText('right')).toBeInTheDocument();
    // 不应该显示左标题
    expect(() => screen.getByText('L')).toThrow();
  });

  it('renders split layout without rightTitle', () => {
    const { getByText } = render(<SlidePreview content={'left---right'} layout="split" metadata={{ leftTitle: 'L' }} />);
    expect(getByText('L')).toBeInTheDocument();
    expect(getByText('left')).toBeInTheDocument();
    expect(getByText('right')).toBeInTheDocument();
    // 不应该显示右标题
    expect(() => screen.getByText('R')).toThrow();
  });

  it('renders split layout without both titles', () => {
    const { getByText } = render(<SlidePreview content={'left---right'} layout="split" metadata={{}} />);
    expect(getByText('left')).toBeInTheDocument();
    expect(getByText('right')).toBeInTheDocument();
    // 不应该显示任何标题
    expect(() => screen.getByText('L')).toThrow();
    expect(() => screen.getByText('R')).toThrow();
  });

  it('renders image layout without imageUrl', () => {
    const { getByText } = render(<SlidePreview content={'img content'} layout="image" metadata={{ caption: 'caption' }} />);
    expect(getByText('caption')).toBeInTheDocument();
    expect(getByText('img content')).toBeInTheDocument();
    // 不应该显示图片
    expect(() => screen.getByRole('img')).toThrow();
  });

  it('renders image layout with empty imageUrl', () => {
    const { getByText } = render(<SlidePreview content={'img content'} layout="image" metadata={{ imageUrl: '', caption: 'caption' }} />);
    expect(getByText('caption')).toBeInTheDocument();
    expect(getByText('img content')).toBeInTheDocument();
    // 不应该显示图片
    expect(() => screen.getByRole('img')).toThrow();
  });

  it('renders image layout with null imageUrl', () => {
    const { getByText } = render(<SlidePreview content={'img content'} layout="image" metadata={{ imageUrl: null, caption: 'caption' }} />);
    expect(getByText('caption')).toBeInTheDocument();
    expect(getByText('img content')).toBeInTheDocument();
    // 不应该显示图片
    expect(() => screen.getByRole('img')).toThrow();
  });

  it('renders fullscreen without mobile', () => {
    const { container } = render(<SlidePreview content={'full'} isFullscreen={true} isMobile={false} currentIndex={2} totalSlides={5} />);
    expect(container.textContent).toContain('full');
    expect(container.textContent).toContain('3/5');
  });

  it('renders fullscreen with mobile', () => {
    const { container } = render(<SlidePreview content={'full'} isFullscreen={true} isMobile={true} currentIndex={2} totalSlides={5} />);
    expect(container.textContent).toContain('full');
    // 移动端不应该显示页码
    expect(container.textContent).not.toContain('3/5');
  });

  it('renders non-fullscreen', () => {
    const { container } = render(<SlidePreview content={'normal'} isFullscreen={false} currentIndex={2} totalSlides={5} />);
    expect(container.textContent).toContain('normal');
    // 非全屏不应该显示页码
    expect(container.textContent).not.toContain('3/5');
  });
}); 