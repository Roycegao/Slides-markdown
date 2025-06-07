const express = require('express');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

const app = express();

// 基础中间件
app.use(cors());
app.use(express.json());

// 数据库配置
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: process.env.VERCEL ? ':memory:' : path.join(__dirname, 'database.sqlite'),
  dialectModule: require('better-sqlite3'),
  logging: false
});

// 延迟初始化
let Slide = null;
let dbInitialized = false;

// 初始化数据库连接
async function getDatabase() {
  if (!sequelize) {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: process.env.VERCEL ? ':memory:' : path.join(__dirname, 'database.sqlite'),
      dialectModule: require('better-sqlite3'),
      logging: false
    });

    // 定义模型
    Slide = sequelize.define('Slide', {
      order: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      metadata: {
        type: DataTypes.JSON,
        defaultValue: {}
      }
    });
  }
  return { sequelize, Slide };
}

// 健康检查端点 - 不依赖数据库
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    memory: process.memoryUsage()
  });
});

// 根路径处理 - 不依赖数据库
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok',
    message: 'Slides API is running',
    version: '1.0.0',
    environment: process.env.NODE_ENV,
    endpoints: {
      slides: '/slides',
      health: '/health'
    }
  });
});

// 数据库初始化函数
async function initializeDatabase() {
  if (dbInitialized) return;
  
  try {
    const { sequelize, Slide } = await getDatabase();
    
    // 测试连接
    await sequelize.authenticate();
    console.log('Database connection established.');
    
    // 同步模型
    await sequelize.sync({ force: true });
    
    // 检查是否需要初始化数据
    const count = await Slide.count();
    if (count === 0) {
      // 分批插入数据以减少内存使用
      const batchSize = 5;
      for (let i = 0; i < defaultSlides.length; i += batchSize) {
        const batch = defaultSlides.slice(i, i + batchSize);
        await Slide.bulkCreate(batch);
      }
      console.log('Default slides initialized successfully');
    }
    
    dbInitialized = true;
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

// 全局错误处理
app.use((err, req, res, next) => {
  console.error('Global error:', err);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
    timestamp: new Date().toISOString()
  });
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

// API 路由处理
app.get('/slides', async (req, res, next) => {
  try {
    await initializeDatabase();
    const { Slide } = await getDatabase();
    const slides = await Slide.findAll({ 
      order: [['order', 'ASC']],
      attributes: ['id', 'order', 'content', 'metadata'] // 只选择需要的字段
    });
    res.json(slides);
  } catch (error) {
    next(error);
  }
});

app.get('/slides/:id', async (req, res, next) => {
  try {
    await initializeDatabase();
    const { Slide } = await getDatabase();
    const slide = await Slide.findByPk(req.params.id, {
      attributes: ['id', 'order', 'content', 'metadata']
    });
    if (!slide) return res.status(404).json({ error: 'Slide not found' });
    res.json(slide);
  } catch (error) {
    next(error);
  }
});

app.post('/slides', async (req, res, next) => {
  try {
    await initializeDatabase();
    const { Slide } = await getDatabase();
    const slide = await Slide.create(req.body);
    res.status(201).json(slide);
  } catch (error) {
    next(error);
  }
});

app.put('/slides/:id', async (req, res, next) => {
  try {
    await initializeDatabase();
    const { Slide } = await getDatabase();
    const slide = await Slide.findByPk(req.params.id);
    if (!slide) {
      return res.status(404).json({ error: 'Slide not found' });
    }
    await slide.update(req.body);
    res.json(slide);
  } catch (error) {
    next(error);
  }
});

app.delete('/slides/:id', async (req, res, next) => {
  try {
    await initializeDatabase();
    const { Slide } = await getDatabase();
    const slide = await Slide.findByPk(req.params.id);
    if (!slide) {
      return res.status(404).json({ error: 'Slide not found' });
    }
    await slide.destroy();
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

// 启动服务器
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  // 不等待数据库初始化
  process.nextTick(() => {
    initializeDatabase().catch(error => {
      console.error('Initial database initialization failed:', error);
    });
  });
});
