const express = require('express');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: process.env.VERCEL ? ':memory:' : path.join(__dirname, 'database.sqlite'),
  dialectModule: require('sqlite3'),
  logging: false
});

const Slide = sequelize.define('Slide', {
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

let dbInitialized = false;


app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    memory: process.memoryUsage()
  });
});


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


async function initializeDatabase() {
  if (dbInitialized) return;
  
  try {

    await sequelize.authenticate();
    console.log('Database connection established.');
    

    await sequelize.sync({ force: true });
    

    const count = await Slide.count();
    if (count === 0) {

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


app.use((err, req, res, next) => {
  console.error('Global error:', err);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
    timestamp: new Date().toISOString()
  });
});


const defaultSlides = [
  {
    order: 1,
    content: "# Markdown Slide Editor\n\nA Modern Presentation Tool Built with React \n\n ![image](https://media.tenor.com/mH_Sq3JI3jkAAAAj/helloworld-programming.gif)",
    metadata: {}
  },
  {
    order: 2,
    content: "## 🎯 Core Features\n\n- ✨ Real-time Markdown editing with live preview\n- 🎨 Multiple slide layouts (Title, Code, Split, Image) \n- ⌨️ Keyboard shortcuts for navigation \n- 🎭 Smooth slide transitions with react-transition-group\n- 📱 Responsive design with mobile-first approach\n- 💾 Auto-save with debounced backend persistence\n- 🖥️ Fullscreen presentation mode\n- 👆 Touch gesture support for mobile navigation",
    metadata: {}
  },
  {
    order: 3,
    content: "## 🏗️ Application Architecture\n\n**Overall Architecture Pattern:**\n- **Client-Server Architecture** with clear separation\n- **Frontend**: React 18 + Vite for fast development & HMR\n- **Backend**: Express.js + SQLite with Sequelize ORM\n- **Deployment**: Vercel serverless functions\n- **Communication**: HTTP/REST API\n\n**Frontend Stack:**\n- React 18 + Vite for fast development & HMR\n- React Transition Group for smooth animations \n- React Markdown + remark-gfm for content rendering\n- @uiw/react-md-editor for rich text editing\n- React Syntax Highlighter for code blocks\n- Custom AST-based rendering for enhanced security\n\n**Backend Stack:**\n- Node.js with Express.js framework\n- SQLite database with Sequelize ORM\n- RESTful API design\n- Vercel serverless deployment\n\n**Development Tools:**\n- Storybook for component development\n- Vitest for unit testing\n- Playwright for E2E testing\n- ESLint for code quality\n- CSS custom properties for theming",
    metadata: {}
  },
  {
    order: 4,
    content: "## 🎨 Component Architecture\n\n**Frontend Component Structure:**\n```\nApp.jsx (Main Container)\n├── SlideEditor.jsx (Markdown Editor)\n├── SlidePreview.jsx (Live Preview)\n├── DraggableSlideList.jsx (Slide Management)\n├── HotKeys.jsx (Keyboard Navigation)\n├── ProgressBar.jsx (Navigation Indicator)\n└── Icons.jsx (UI Icons)\n```\n\n**Backend API Design:**\n```\nRESTful Endpoints:\nGET    /health          - Health check\nGET    /                - API info\nGET    /slides          - Fetch all slides\nGET    /slides/:id      - Fetch single slide\nPOST   /slides          - Create new slide\nPUT    /slides/:id      - Update slide\nDELETE /slides/:id      - Delete slide\n```\n\n**Database Schema:**\n```sql\nSlide {\n  id: INTEGER (Primary Key)\n  order: INTEGER (Slide sequence)\n  content: TEXT (Markdown content)\n  metadata: JSON (Layout and additional data)\n}\n```",
    metadata: {}
  },
  {
    order: 5,
    content: "## 💡 Design Considerations\n\n**Technology Choices:**\n\n**1. Vite over Create React App**\n- **Choice**: Used Vite for faster development experience\n- **Reason**: Better HMR, faster build times, modern tooling\n- **Future Accommodation**: Easier migration to newer React features\n\n**2. SQLite over PostgreSQL/MySQL**\n- **Choice**: SQLite for simplicity and deployment ease\n- **Reason**: Serverless-friendly, no external database dependency\n- **Future Accommodation**: Can easily migrate to PostgreSQL for production scale\n\n**3. Local State over Redux/Zustand**\n- **Choice**: React hooks for state management\n- **Reason**: Simplicity for current feature set\n- **Future Accommodation**: Can add global state management when needed\n\n**4. Debounced Auto-save**\n- **Choice**: 500ms debounce for auto-save\n- **Reason**: Balance between responsiveness and performance\n- **Future Accommodation**: Configurable debounce timing",
    metadata: {}
  },
  {
    order: 6,
    content: "## 🏛️ Architecture Decisions\n\n**Component-Driven Development**\n- Used Storybook for component isolation\n- Modular component structure for reusability\n- Clear separation of concerns\n\n**Mobile-First Responsive Design**\n- Tab-based navigation for mobile devices\n- Touch gesture support\n- Landscape/portrait mode optimization\n\n**Security Considerations**\n- Custom AST-based rendering for markdown\n- Input sanitization through React Markdown\n- CORS configuration for API access\n\n**Performance Optimizations**\n- React.memo for component memoization\n- Efficient re-rendering strategies\n- Lazy loading capabilities\n- Smooth animations with CSS transforms",
    metadata: {}
  },
  {
    order: 7,
    content: "## 🎓 Key Takeaways\n\n**Component Design**\n- Clean component architecture with proper separation of concerns\n- Reusable components improve maintainability\n- Storybook facilitates component development and testing\n\n**State Management**\n- Local state sufficient for current feature set\n- Optimistic updates create responsive feel\n- Proper error handling improves user trust\n\n**Development Workflow**\n- Test-first approach with Vitest & Playwright\n- Documentation importance for maintainability\n- Code quality with ESLint & proper linting\n\n**User Experience**\n- Smooth animations significantly improve perceived performance\n- Mobile responsiveness is crucial for modern apps\n- Keyboard shortcuts and touch gestures enhance efficiency\n- Consistent design across all screen sizes matters\n\n**Technical Excellence**\n- Debounced operations prevent performance issues\n- Proper error handling improves user trust\n- Optimistic updates create responsive feel\n- Accessibility considerations are essential",
    metadata: {}
  },
  {
    order: 8,
    content: "## 🔮 Future Considerations\n\nThe architecture accommodates several future enhancements:\n\n**Real-time Collaboration**\n- WebSocket integration for live editing\n- User presence indicators & live cursors\n\n**Export & Sharing**\n- PDF/PPT export functionality\n\n**AI-Powered Features**\n- AI-driven content suggestions\n- Voice-to-text input\n- Automated slide generation\n- Smart content optimization\n\n**Scalability**\n- Migration to PostgreSQL for larger datasets\n- Load balancing\n- Caching strategies",
    metadata: {}
  },
  {
    order: 9,
    content: "## 👨‍💻 Author\n\n- Name: **Royce**\n- Experience: 9 years full-stack development\n- Stack: Java (Spring), Python, React, MySQL, Node.js, LLM, RAG\n- Email: **roycegao513@gmail.com**\n\n🧠 Thank you for reading! \n\n ![image](https://pbs.twimg.com/profile_images/1723248873806942208/EalEraX0_400x400.jpg)",
    metadata: {}
  }
];


app.get('/slides', async (req, res, next) => {
  try {
    await initializeDatabase();
    const slides = await Slide.findAll({ 
      order: [['order', 'ASC']],
      attributes: ['id', 'order', 'content', 'metadata']
    });
    res.json(slides);
  } catch (error) {
    next(error);
  }
});

app.get('/slides/:id', async (req, res, next) => {
  try {
    await initializeDatabase();
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
    const slide = await Slide.create(req.body);
    res.status(201).json(slide);
  } catch (error) {
    next(error);
  }
});

app.put('/slides/:id', async (req, res, next) => {
  try {
    await initializeDatabase();
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


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);

  process.nextTick(() => {
    initializeDatabase().catch(error => {
      console.error('Initial database initialization failed:', error);
    });
  });
});
