import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const DroppableComponent = ({ children, ...props }) => (
  <Droppable {...props}>
    {(provided) => (
      <div
        className="slides-list"
        ref={provided.innerRef}
        {...provided.droppableProps}
      >
        {children(provided)}
      </div>
    )}
  </Droppable>
);

export default function DraggableSlideList({ slides, currentSlideId, onSelect, onReorder }) {
  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    if (sourceIndex === destinationIndex) return;

    // Create new slides array
    const newSlides = Array.from(slides);
    const [removed] = newSlides.splice(sourceIndex, 1);
    newSlides.splice(destinationIndex, 0, removed);

    // Update order for each slide
    const updatedSlides = newSlides.map((slide, index) => ({
      ...slide,
      order: index
    }));

    onReorder(updatedSlides);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <DroppableComponent droppableId="slides">
        {(provided) => (
          <>
            {slides.map((slide, index) => (
              <Draggable
                key={slide.id}
                draggableId={String(slide.id)}
                index={index}
              >
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`slide-item ${slide.id === currentSlideId ? "active" : ""} ${
                      snapshot.isDragging ? "dragging" : ""
                    }`}
                    onClick={() => onSelect(slide.id)}
                  >
                    <div className="slide-item-header">
                      <div className="slide-item-order">{index + 1}</div>
                      <div className="slide-item-drag-handle">⋮⋮</div>
                    </div>
                    <div className="slide-item-title">
                      {slide.content.split('\n')[0].replace(/^#+\s*/, '')}
                    </div>
                    <div className="slide-item-preview">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {slide.content.split('\n').slice(1, 3).join('\n')}
                      </ReactMarkdown>
                    </div>
                    {/* <div className="slide-item-layout">
                      {slide.layout}
                    </div> */}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </>
        )}
      </DroppableComponent>
    </DragDropContext>
  );
} 