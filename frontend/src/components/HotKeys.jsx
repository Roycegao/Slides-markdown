import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

function isEditableElement(target) {
  if (!target) return false;
  const tag = target.tagName && target.tagName.toUpperCase();
  if (!tag) return false;
  const editableTags = ['INPUT', 'TEXTAREA', 'SELECT'];
  if (editableTags.includes(tag)) return true;
  if (target.isContentEditable) return true;
  // 检查是否在 markdown 编辑器输入区内
  let el = target;
  while (el) {
    if (
      el.classList &&
      (
        el.classList.contains('w-md-editor') ||
        el.classList.contains('w-md-editor-text-input') ||
        el.classList.contains('w-md-editor-content')
      )
    ) {
      return true;
    }
    el = el.parentElement;
  }
  return false;
}

const HotKeys = ({
  onSave,
  onAddSlide,
  onDeleteSlide,
  onToggleFullscreen,
  onNextSlide,
  onPrevSlide,
  disabled = false,
}) => {
  const [allDisabled, setAllDisabled] = useState(disabled);

  useEffect(() => {
    setAllDisabled(disabled);
  }, [disabled]);

  const handleKeyDown = (event) => {
    if (allDisabled) return;
    // 只有在非输入框/非可编辑元素时才处理方向键
    if (!isEditableElement(event.target)) {
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          onPrevSlide();
          return;
        case 'ArrowRight':
          event.preventDefault();
          onNextSlide();
          return;
        case 'ArrowUp':
          event.preventDefault();
          onPrevSlide();
          return;
        case 'ArrowDown':
          event.preventDefault();
          onNextSlide();
          return;
        case 'Escape':
          event.preventDefault();
          onToggleFullscreen();
          return;
      }
    }

    // 其他热键功能
    if (event.ctrlKey || event.metaKey) {
      switch (event.key.toLowerCase()) {
        case 's':
          event.preventDefault();
          onSave();
          break;
        case 'n':
          event.preventDefault();
          onAddSlide();
          break;
        case 'd':
          event.preventDefault();
          onDeleteSlide();
          break;
        case 'f':
          event.preventDefault();
          onToggleFullscreen();
          break;
        default:
          break;
      }
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [allDisabled, onSave, onAddSlide, onDeleteSlide, onToggleFullscreen, onNextSlide, onPrevSlide]);

  return null;
};

HotKeys.propTypes = {
  onSave: PropTypes.func.isRequired,
  onAddSlide: PropTypes.func.isRequired,
  onDeleteSlide: PropTypes.func.isRequired,
  onToggleFullscreen: PropTypes.func.isRequired,
  onNextSlide: PropTypes.func.isRequired,
  onPrevSlide: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

export default HotKeys; 