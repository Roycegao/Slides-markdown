# Slide Presentation Editor - Backend

A robust, scalable backend service for the Slide Presentation Editor, built with Node.js and Express, featuring a SQLite database for data persistence and comprehensive API endpoints for slide management.

## 🚀 Features

- **RESTful API**
  - CRUD operations for slides
  - Slide reordering functionality
  - Real-time data validation
  - Error handling middleware

- **Data Management**
  - SQLite database integration
  - Efficient data querying
  - Data integrity constraints
  - Automatic schema migrations

- **Security**
  - Input validation
  - SQL injection prevention
  - CORS configuration
  - Rate limiting

- **Development Tools**
  - Hot reloading
  - API documentation
  - Comprehensive testing suite
  - Logging and monitoring

## 🛠️ Tech Stack

- **Core Framework**
  - Node.js
  - Express.js
  - SQLite3
  - Sequelize ORM

- **Development & Testing**
  - Jest for unit testing
  - Supertest for API testing
  - ESLint for code linting
  - Nodemon for development

- **API Documentation**
  - Swagger/OpenAPI
  - JSDoc for code documentation

## 📦 Installation

```bash
# Clone the repository
git clone <repository-url>

# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Start the development server
npm run dev

# Start the production server
npm start

# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 📝 API Documentation

### Endpoints

#### Slides Management

- `GET /api/slides`
  - Fetch all slides
  - Query parameters: `order`, `limit`, `offset`
  - Returns: Array of slide objects

- `GET /api/slides/:id`
  - Fetch a single slide
  - Parameters: `id` (slide ID)
  - Returns: Slide object

- `POST /api/slides`
  - Create a new slide
  - Body: `{ title, content, layout, order }`
  - Returns: Created slide object

- `PUT /api/slides/:id`
  - Update a slide
  - Parameters: `id` (slide ID)
  - Body: `{ title, content, layout, order }`
  - Returns: Updated slide object

- `DELETE /api/slides/:id`
  - Delete a slide
  - Parameters: `id` (slide ID)
  - Returns: Success message

- `PUT /api/slides/reorder`
  - Reorder slides
  - Body: `{ slides: [{ id, order }] }`
  - Returns: Updated slides array

### Data Models

#### Slide

```javascript
{
  id: Integer,
  title: String,
  content: Text,
  layout: String,
  order: Integer,
  createdAt: DateTime,
  updatedAt: DateTime
}
```

## 🧪 Testing

### Unit Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- __tests__/slides.test.js
```

### API Tests

```bash
# Run API tests
npm run test:api

# Run API tests with coverage
npm run test:api:coverage
```

## 📊 Database

### Schema

```sql
CREATE TABLE slides (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT,
  layout TEXT NOT NULL DEFAULT 'default',
  order INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Migrations

```bash
# Create a new migration
npm run migration:create -- --name migration-name

# Run migrations
npm run migration:up

# Rollback migrations
npm run migration:down
```

## 🔧 Configuration

Environment variables (`.env`):

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_PATH=./database.sqlite

# API Configuration
API_PREFIX=/api
CORS_ORIGIN=http://localhost:5173

# Security
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
```

## 📝 Development Guidelines

1. **Code Style**
   - Follow ESLint configuration
   - Use async/await for asynchronous operations
   - Implement proper error handling
   - Write meaningful comments and documentation

2. **API Design**
   - Follow RESTful principles
   - Use proper HTTP methods
   - Implement proper status codes
   - Validate all input data

3. **Testing**
   - Write unit tests for all functions
   - Write integration tests for API endpoints
   - Maintain good test coverage
   - Use meaningful test descriptions

4. **Security**
   - Validate all user input
   - Implement proper error handling
   - Use parameterized queries
   - Follow security best practices

## 🔄 API Integration

### Example API Usage

```javascript
// Fetch all slides
const response = await fetch('http://localhost:3000/api/slides');
const slides = await response.json();

// Create a new slide
const newSlide = await fetch('http://localhost:3000/api/slides', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    title: 'New Slide',
    content: '# Content',
    layout: 'default',
    order: 1,
  }),
});
```

## 📄 License

MIT License - see LICENSE file for details
5. Open a Pull Request
