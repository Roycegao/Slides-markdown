import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

function isEditableElement(target) {
  if (!target) return false;
  const tag = target.tagName;
  if (!tag) return false;
  const editableTags = ['INPUT', 'TEXTAREA', 'SELECT'];
  if (editableTags.includes(tag)) return true;
  if (target.isContentEditable) return true;
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
    // 方向键翻页功能始终可用
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

    // 如果热键被禁用，不处理其他按键
    if (allDisabled) {
      return;
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