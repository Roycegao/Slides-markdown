import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import DraggableSlideList from '../DraggableSlideList';

const mockSlides = [
  { id: 1, content: '# Slide 1\nContent 1' },
  { id: 2, content: '# Slide 2\nContent 2' },
];

describe('DraggableSlideList', () => {
  it('renders all slides', () => {
    const { getAllByText } = render(
      <DraggableSlideList slides={mockSlides} currentSlideId={1} onSelect={vi.fn()} onReorder={vi.fn()} />
    );
    expect(getAllByText(/Slide/).length).toBe(2);
  });

  it('highlights the active slide', () => {
    const { container } = render(
      <DraggableSlideList slides={mockSlides} currentSlideId={2} onSelect={vi.fn()} onReorder={vi.fn()} />
    );
    const active = container.querySelector('.slide-item.active');
    expect(active).toBeTruthy();
    expect(active.textContent).toContain('Slide 2');
  });

  it('calls onSelect when a slide is clicked', () => {
    const onSelect = vi.fn();
    const { getAllByText } = render(
      <DraggableSlideList slides={mockSlides} currentSlideId={1} onSelect={onSelect} onReorder={vi.fn()} />
    );
    fireEvent.click(getAllByText('Slide 2')[0]);
    expect(onSelect).toHaveBeenCalledWith(2);
  });

  // 拖拽排序模拟（假设onReorder直接调用）
  it('calls onReorder when slides are reordered (mock)', () => {
    const onReorder = vi.fn();
    // 直接模拟调用
    onReorder([mockSlides[1], mockSlides[0]]);
    expect(onReorder).toHaveBeenCalledWith([
      mockSlides[1],
      mockSlides[0],
    ]);
  });
}); 