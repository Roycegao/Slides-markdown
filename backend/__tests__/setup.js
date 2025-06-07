const { Sequelize } = require('sequelize');
const path = require('path');

// Use in-memory database for testing
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: ':memory:',
  logging: false
});

// Expose sequelize instance to test files
global.testSequelize = sequelize;

// Reset database before each test
beforeEach(async () => {
  await sequelize.sync({ force: true });
});

// Close database connection after all tests
afterAll(async () => {
  await sequelize.close();
}); 