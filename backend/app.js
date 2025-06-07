const express = require('express');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// SQLite 数据库初始化
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, 'database.sqlite'),
});

// Slide 模型
const Slide = sequelize.define('Slide', {
  order: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT, // markdown 内容
    allowNull: false,
  },
  // layout: {
  //   type: DataTypes.STRING,
  //   defaultValue: 'default', // 支持不同布局
  // },
  metadata: {
    type: DataTypes.JSON,
    defaultValue: {}
  }
});

// 默认幻灯片数据
const defaultSlides = [
  {
    order: 1,
    content: "# Markdown Slide Editor\n\nA Modern Presentation Tool Built with React",

    metadata: {}
  },
  {
    order: 2,
    content: "## 🎯 Core Features\n\n- ✨ Real-time Markdown editing with live preview\n- 🎨 Multiple slide layouts (Title, Code, Split, Image)\n- 🖱️ Drag-and-drop slide reordering\n- ⌨️ Keyboard shortcuts for navigation\n- 🎭 Smooth slide transitions & animations\n- 📱 Responsive & mobile-friendly design\n- 💾 Auto-save with backend persistence",

    metadata: {}
  },
  {
    order: 3,
    content: "## 📐 Technical Architecture\n\n**Frontend:**\n- React 18 + Vite for fast development\n- React Transition Group for animations\n- React Beautiful DnD for drag-and-drop\n- React Markdown + remark-gfm for content\n- AST-based rendering for safety\n- Storybook for component development\n- Vitest for unit testing\n\n**Backend:**\n- Node.js + Express REST API\n- Sequelize ORM for data management\n- SQLite for lightweight storage\n- Jest for API testing",

    metadata: {}
  },
  {
    order: 4,
    content: "## 💡 Technical Highlights\n **AST-based Markdown Rendering**\n   - Custom component mapping\n   - Enhanced security\n   - Better performance\n **Smooth Animations**\n   - Slide transitions\n   - Fullscreen mode\n   - Drag-and-drop effects\n **Responsive Design**\n   - Mobile-first approach\n   - Adaptive layouts\n   - Touch-friendly interactions",

    metadata: {}
  },
  {
    order: 5,
    content: "## 🔧 Implementation Details\n\n```js\n// Example: Slide Transition Component\nConsole.log('hello word!')\n```\n\n✅ Clean component architecture with proper separation of concerns",

    metadata: {}
  },
  {
    order: 6,
    content: "## 🎨 Slide Layouts\n\n| Layout Type | Description | Use Case |\n|-------------|-------------|----------|\n| Title | Large centered text | Opening slides |\n| Default | Standard content | General content |\n| Code | Syntax highlighting | Code examples |\n| Split | Two-column layout | Comparisons |\n| Image | Image with caption | Visual content |\n\n✅ Flexible layout system with metadata support",

    metadata: {}
  },
  {
    order: 7,
    content: "## 🚧 Challenges & Solutions\n\n**Challenge 1: Drag-and-Drop Performance**\n- Solution: Optimized re-renders with React.memo\n- Used react-beautiful-dnd for smooth animations\n\n**Challenge 2: Markdown Parsing**\n- Solution: Custom AST renderer for better control\n- Implemented syntax highlighting with rehype-highlight\n\n**Challenge 3: State Management**\n- Solution: Local state with proper data flow\n- Optimistic updates for better UX",

    metadata: {}
  },
  {
    order: 8,
    content: "## 📈 Future Improvements\n **Collaboration Features**\n   - Real-time editing with WebSocket\n   - User presence & cursors\n   - Comments & annotations\n **Export & Sharing**\n   - PDF/PPT export\n   - Shareable links\n   - Version control\n **Enhanced Editing**\n   - Slide templates\n   - Image upload & management\n   - AI-powered content suggestions\n\ **Performance**\n   - Slide lazy loading\n   - Image optimization\n   - Caching strategy",

    metadata: {}
  },
  {
    order: 9,
    content: "## 🎓 Key Takeaways\n **Architecture Decisions**\n   - Choosing the right tools for the job\n   - Balancing complexity vs. features\n   - Planning for scalability\n\ **Development Process**\n   - Component-driven development\n   - Test-first approach\n   - Documentation importance\n\ **User Experience**\n   - Smooth animations matter\n   - Mobile responsiveness is crucial\n   - Keyboard shortcuts improve efficiency",

    metadata: {}
  },
  {
    order: 10,
    content: "## 👨‍💻 Author\n\n- Name: **Royce**\n- Age: 34\n- Experience: 9 years full-stack development\n- Stack: Java (Spring), Python, React, MySQL, Node.js, LLM, RAG\n- Email: **roycegao513@gmail.com**\n\n🧠 Thank you for reading!",

    metadata: {}
  }
];

// 初始化数据库
async function initializeDatabase() {
  try {
    await sequelize.sync({ force: true }); // 注意：这会清空现有数据
    const count = await Slide.count();
    if (count === 0) {
      await Slide.bulkCreate(defaultSlides);
      console.log('Default slides initialized successfully');
    }
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

// 路由 - 获取所有幻灯片，按顺序
app.get('/slides', async (req, res) => {
  try {
    const slides = await Slide.findAll({ order: [['order', 'ASC']] });
    res.json(slides);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 路由 - 获取单个幻灯片
app.get('/slides/:id', async (req, res) => {
  const slide = await Slide.findByPk(req.params.id);
  if (!slide) return res.status(404).json({ error: 'Slide not found' });
  res.json(slide);
});

// 路由 - 创建新幻灯片
app.post('/slides', async (req, res) => {
  try {
    const slide = await Slide.create(req.body);
    res.status(201).json(slide);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 路由 - 更新幻灯片
app.put('/slides/:id', async (req, res) => {
  try {
    const slide = await Slide.findByPk(req.params.id);
    if (!slide) {
      return res.status(404).json({ error: 'Slide not found' });
    }
    await slide.update(req.body);
    res.json(slide);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 路由 - 删除幻灯片
app.delete('/slides/:id', async (req, res) => {
  try {
    const slide = await Slide.findByPk(req.params.id);
    if (!slide) {
      return res.status(404).json({ error: 'Slide not found' });
    }
    await slide.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 启动服务器
const PORT = process.env.PORT || 4000;
app.listen(PORT, async () => {
  await initializeDatabase();
  console.log(`Server is running on port ${PORT}`);
});
