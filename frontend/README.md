# Slide Presentation Editor - Frontend

A modern, responsive slide presentation editor built with React, featuring a rich markdown editor, real-time preview, and beautiful animations.

## 🚀 Features

- **Rich Markdown Editor**
  - AST-based markdown rendering
  - Custom component mapping
  - Syntax highlighting for code blocks
  - Support for tables, lists, and images

- **Multiple Layout Templates**
  - Title layout for cover slides
  - Default layout for content slides
  - Code layout with syntax highlighting
  - Split layout for side-by-side content
  - Image layout for visual presentations

- **Interactive Features**
  - Real-time preview
  - Drag-and-drop slide reordering
  - Fullscreen presentation mode
  - Slide transitions and animations
  - Keyboard shortcuts for navigation

- **Responsive Design**
  - Mobile-first approach
  - Adaptive layouts
  - Touch-friendly interactions
  - Responsive typography

## 🛠️ Tech Stack

- **Core Framework**
  - React 18
  - Vite 5
  - React Router 6

- **UI Components & Styling**
  - CSS Modules
  - Custom CSS variables for theming
  - React Transition Group for animations
  - React Beautiful DnD for drag-and-drop

- **Markdown Processing**
  - React Markdown
  - Remark GFM
  - Highlight.js for code syntax

- **Development Tools**
  - ESLint for code linting
  - Vitest for unit testing
  - Playwright for E2E testing
  - Storybook for component development

## 📦 Installation

# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev

# Build for production
npm run build

# Run tests
npm test


# test coverage
npm run test:coverage

# Start Storybook
npm run storybook
```


## 🎨 Customization

### Themes

The application supports both light and dark themes. Theme variables are defined in `src/styles/global.css`:

```css
:root {
  --bg-primary: #ffffff;
  --text-primary: #333333;
  /* ... other theme variables ... */
}

[data-theme="dark"] {
  --bg-primary: #1a1a1a;
  --text-primary: #ffffff;
  /* ... dark theme variables ... */
}
```

### Layouts

Custom slide layouts can be added by:
1. Creating a new layout component in `src/components/layouts/`
2. Adding the layout styles in `src/styles/global.css`
3. Registering the layout in the slide editor component

## 🧪 Testing

- **Unit Tests**: `npm test`
  - Component testing with Vitest
  - Snapshot testing
  - Mock service worker for API testing

- **E2E Tests**: `npm run test:e2e`
  - Playwright for end-to-end testing
  - Cross-browser testing
  - Visual regression testing

- **Component Development**: `npm run storybook`
  - Isolated component development
  - Interactive documentation
  - Visual testing

## 📝 Development Guidelines

1. **Code Style**
   - Follow ESLint configuration
   - Use functional components with hooks
   - Implement proper error boundaries
   - Write meaningful component documentation

2. **Performance**
   - Implement proper memoization
   - Use lazy loading for routes
   - Optimize bundle size
   - Monitor render performance

3. **Accessibility**
   - Follow WCAG 2.1 guidelines
   - Implement proper ARIA attributes
   - Ensure keyboard navigation
   - Maintain proper color contrast

## 🔄 API Integration

The frontend communicates with the backend through RESTful APIs:

- `GET /api/slides` - Fetch all slides
- `POST /api/slides` - Create a new slide
- `PUT /api/slides/:id` - Update a slide
- `DELETE /api/slides/:id` - Delete a slide
- `PUT /api/slides/reorder` - Reorder slides

## 📄 License

MIT License - see LICENSE file for details
