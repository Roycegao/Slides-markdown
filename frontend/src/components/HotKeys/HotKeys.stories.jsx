import HotKeys from "../HotKeys";

export default {
  title: 'Components/HotKeys',
  component: HotKeys,
  tags: ['autodocs'],
  argTypes: {
    onSave: {
      action: 'saved',
      description: 'Callback when save is triggered',
    },
    onNew: {
      action: 'new',
      description: 'Callback when new slide is triggered',
    },
    onDelete: {
      action: 'deleted',
      description: 'Callback when delete is triggered',
    },
    onNext: {
      action: 'next',
      description: 'Callback when next slide is triggered',
    },
    onPrevious: {
      action: 'previous',
      description: 'Callback when previous slide is triggered',
    },
    onTogglePreview: {
      action: 'preview toggled',
      description: 'Callback when preview is toggled',
    },
  },
};

// 基础故事
export const Default = {
  args: {},
};

// 禁用部分快捷键故事
export const DisabledKeys = {
  args: {
    disabledKeys: ['save', 'delete'],
  },
};

// 自定义快捷键故事
export const CustomShortcuts = {
  args: {
    shortcuts: {
      save: 'Alt+S',
      new: 'Alt+N',
      delete: 'Alt+D',
      next: 'Alt+Right',
      previous: 'Alt+Left',
      preview: 'Alt+P',
    },
  },
};

// 组合键故事
export const WithModifiers = {
  args: {
    shortcuts: {
      save: 'Control+Shift+S',
      new: 'Control+Shift+N',
      delete: 'Control+Shift+D',
      next: 'Control+Shift+Right',
      previous: 'Control+Shift+Left',
      preview: 'Control+Shift+P',
    },
  },
};

// 国际化故事
export const Internationalized = {
  args: {
    labels: {
      save: '保存 (Ctrl+S)',
      new: '新建 (Ctrl+N)',
      delete: '删除 (Ctrl+D)',
      next: '下一页 (→)',
      previous: '上一页 (←)',
      preview: '预览 (Ctrl+P)',
    },
  },
};

// 工具提示故事
export const WithTooltips = {
  args: {
    showTooltips: true,
    tooltips: {
      save: '保存当前幻灯片',
      new: '创建新幻灯片',
      delete: '删除当前幻灯片',
      next: '切换到下一张幻灯片',
      previous: '切换到上一张幻灯片',
      preview: '切换预览模式',
    },
  },
};

// 键盘事件监听故事
export const WithEventListeners = {
  args: {
    onKeyDown: (event) => {
      console.log('Key pressed:', event.key);
    },
    onKeyUp: (event) => {
      console.log('Key released:', event.key);
    },
  },
};

// 错误处理故事
export const WithErrorHandling = {
  args: {
    onError: (error) => {
      console.error('Hotkey error:', error);
    },
  },
};

// 性能优化故事
export const WithDebounce = {
  args: {
    debounceTime: 300,
  },
}; 