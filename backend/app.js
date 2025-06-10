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
    content: "## 📐 Technical Architecture\n\n**Frontend Stack:**\n- React 18 + Vite for fast development & HMR\n- React Transition Group for smooth animations \n- React Markdown + remark-gfm for content rendering\n- @uiw/react-md-editor for rich text editing\n- React Syntax Highlighter for code blocks\n- Custom AST-based rendering for enhanced security\n\n**Development Tools:**\n- Storybook for component development\n- Vitest for unit testing\n- Playwright for E2E testing\n- ESLint for code quality\n- CSS custom properties for theming",

    metadata: {}
  },
  {
    order: 4,
    content: "## 💡 Technical Highlights\n\n**Responsive Design System**\n- Mobile-first approach with adaptive layouts\n- Touch-friendly interactions and gestures\n- Landscape/portrait mode optimization\n- Fixed sidebar headers for better UX\n\n**Advanced State Management**\n- Optimistic updates for smooth interactions\n- Debounced auto-save (500ms delay)\n- Local state with proper data flow\n- Error handling with user feedback\n\n**Performance Optimizations**\n- React.memo for component memoization\n- Efficient re-rendering strategies\n- Lazy loading and code splitting\n- Smooth animations with CSS transforms",

    metadata: {}
  },
  {
    order: 5,
    content: "## 🔧 Implementation Details\n\n```jsx\n console.log('hello world!')```\n\n✅ Clean component architecture with proper separation of concerns",

    metadata: {}
  },
  {
    order: 6,
    content: "## 🎨 Slide Layouts & Features\n\n| Feature | Description | Implementation |\n|---------|-------------|---------------|\n| Title Layout | Large centered text | CSS Grid with flexbox |\n| Default Layout | Standard content flow | Responsive typography |\n| Code Layout | Syntax highlighting | React Syntax Highlighter |\n| Split Layout | Two-column design | CSS Grid layout |\n| Image Layout | Image with caption | Object-fit optimization |\n| Fullscreen Mode | Presentation view | Fixed positioning |\n| Mobile Navigation | Touch gestures | Touch event handlers |\n\n✅ Flexible layout system with metadata support",

    metadata: {}
  },
  {
    order: 7,
    content: "## 🚧 Challenges & Solutions\n\n**Challenge 1: Mobile Responsiveness**\n- Problem: Complex layout on small screens\n- Solution: Tab-based navigation for mobile, landscape mode optimization\n- Result: Seamless experience across all devices\n\n**Challenge 2: Real-time Auto-save**\n- Problem: Performance impact of frequent API calls\n- Solution: Debounced save with 500ms delay\n- Result: Smooth editing without lag\n\n**Challenge 3: Touch Gesture Navigation**\n- Problem: Swipe gestures conflicting with scrollable content\n- Solution: Smart gesture detection excluding code blocks and tables\n- Result: Intuitive mobile navigation\n\n**Challenge 4: Code Block Styling**\n- Problem: Inconsistent appearance across screen orientations\n- Solution: Unified CSS with responsive breakpoints\n- Result: Consistent code display everywhere",

    metadata: {}
  },
  {
    order: 8,
    content: "## 📈 Future Improvements\n\n**Enhanced Collaboration**\n- Real-time editing with WebSocket integration\n- User presence indicators & live cursors\n- Comments & annotations system\n- Version control & history tracking\n\n**Export & Sharing**\n- PDF/PPT export functionality\n- Shareable presentation links\n- QR code generation for mobile access\n- Cloud storage integration\n\n**Advanced Editing**\n- Slide templates library\n- Image upload & management\n- AI-powered content suggestions\n- Voice-to-text input\n\n**Performance & UX**\n- Virtual scrolling for large presentations\n- Image lazy loading & optimization\n- Progressive web app (PWA) features\n- Offline mode support",

    metadata: {}
  },
  {
    order: 9,
    content: "## 🎓 Key Takeaways\n\n**Architecture Decisions**\n- Choosing the right tools for the job (Vite over CRA)\n- Balancing complexity vs. features\n- Planning for scalability from day one\n- Mobile-first responsive design approach\n\n**Development Process**\n- Component-driven development with Storybook\n- Test-first approach with Vitest & Playwright\n- Documentation importance for maintainability\n- Code quality with ESLint & proper linting\n\n**User Experience**\n- Smooth animations significantly improve perceived performance\n- Mobile responsiveness is crucial for modern apps\n- Keyboard shortcuts and touch gestures enhance efficiency\n- Consistent design across all screen sizes matters\n\n**Technical Excellence**\n- Debounced operations prevent performance issues\n- Proper error handling improves user trust\n- Optimistic updates create responsive feel\n- Accessibility considerations are essential",

    metadata: {}
  },
  {
    order: 10,
    content: "## 👨‍💻 Author\n\n- Name: **Royce**\n- Age: 34\n- Experience: 9 years full-stack development\n- Stack: Java (Spring), Python, React, MySQL, Node.js, LLM, RAG\n- Email: **roycegao513@gmail.com**\n\n🧠 Thank you for reading! \n\n ![image](https://pbs.twimg.com/profile_images/1723248873806942208/EalEraX0_400x400.jpg)",

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
