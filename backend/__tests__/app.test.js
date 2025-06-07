const request = require('supertest');
const { Sequelize, DataTypes } = require('sequelize');
const express = require('express');
const cors = require('cors');

// Create test application instance
const app = express();
app.use(cors());
app.use(express.json());

// Use test database
const sequelize = global.testSequelize;

// Define Slide model for testing
const Slide = sequelize.define('Slide', {
  order: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  layout: {
    type: DataTypes.STRING,
    defaultValue: 'default',
  },
  metadata: {
    type: DataTypes.JSON,
    defaultValue: {}
  }
});

// Copy routes from app.js
app.get('/slides', async (req, res) => {
  try {
    const slides = await Slide.findAll({ order: [['order', 'ASC']] });
    res.json(slides);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/slides/:id', async (req, res) => {
  const slide = await Slide.findByPk(req.params.id);
  if (!slide) return res.status(404).json({ error: 'Slide not found' });
  res.json(slide);
});

app.post('/slides', async (req, res) => {
  try {
    const slide = await Slide.create(req.body);
    res.status(201).json(slide);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

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

describe('Slide API', () => {
  // Test data
  const testSlide = {
    order: 1,
    content: '# Test Slide',
    layout: 'default',
    metadata: {}
  };

  describe('GET /slides', () => {
    it('should return empty array when no slides exist', async () => {
      const response = await request(app).get('/slides');
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it('should return all slides in order', async () => {
      // Create test data
      const slide1 = await Slide.create({ ...testSlide, order: 2 });
      const slide2 = await Slide.create({ ...testSlide, order: 1 });

      const response = await request(app).get('/slides');
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].order).toBe(1);
      expect(response.body[1].order).toBe(2);
    });
  });

  describe('GET /slides/:id', () => {
    it('should return 404 for non-existent slide', async () => {
      const response = await request(app).get('/slides/999');
      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Slide not found');
    });

    it('should return slide by id', async () => {
      const slide = await Slide.create(testSlide);
      const response = await request(app).get(`/slides/${slide.id}`);
      expect(response.status).toBe(200);
      expect(response.body.id).toBe(slide.id);
      expect(response.body.content).toBe(testSlide.content);
    });
  });

  describe('POST /slides', () => {
    it('should create new slide', async () => {
      const response = await request(app)
        .post('/slides')
        .send(testSlide);

      expect(response.status).toBe(201);
      expect(response.body.content).toBe(testSlide.content);
      expect(response.body.order).toBe(testSlide.order);
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/slides')
        .send({});

      expect(response.status).toBe(400);
    });
  });

  describe('PUT /slides/:id', () => {
    it('should update existing slide', async () => {
      const slide = await Slide.create(testSlide);
      const updateData = { content: '# Updated Slide' };

      const response = await request(app)
        .put(`/slides/${slide.id}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.content).toBe(updateData.content);
    });

    it('should return 404 for non-existent slide', async () => {
      const response = await request(app)
        .put('/slides/999')
        .send({ content: '# Updated Slide' });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Slide not found');
    });
  });

  describe('DELETE /slides/:id', () => {
    it('should delete existing slide', async () => {
      const slide = await Slide.create(testSlide);
      const response = await request(app).delete(`/slides/${slide.id}`);
      expect(response.status).toBe(204);

      // Verify slide has been deleted
      const deletedSlide = await Slide.findByPk(slide.id);
      expect(deletedSlide).toBeNull();
    });

    it('should return 404 for non-existent slide', async () => {
      const response = await request(app).delete('/slides/999');
      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Slide not found');
    });
  });
}); 