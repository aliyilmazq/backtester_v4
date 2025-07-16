const request = require('supertest');
const app = require('../../server/server');

describe('Data API Integration Tests', () => {
  describe('GET /api/data/market', () => {
    it('should validate required parameters', async () => {
      const response = await request(app)
        .get('/api/data/market')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('required');
    });

    it('should validate date format', async () => {
      const response = await request(app)
        .get('/api/data/market')
        .query({
          symbol: 'AAPL',
          from: 'invalid-date',
          to: '2023-12-31'
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Invalid date format');
    });

    it('should validate date range', async () => {
      const response = await request(app)
        .get('/api/data/market')
        .query({
          symbol: 'AAPL',
          from: '2023-12-31',
          to: '2023-01-01'
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('From date must be before to date');
    });

    // Note: Actual API call test requires valid API key
    it('should return error when API key is missing', async () => {
      // Temporarily remove API key
      const originalKey = process.env.POLYGON_API_KEY;
      delete process.env.POLYGON_API_KEY;

      const response = await request(app)
        .get('/api/data/market')
        .query({
          symbol: 'AAPL',
          from: '2023-01-01',
          to: '2023-12-31'
        })
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('API key not configured');

      // Restore API key
      if (originalKey) {
        process.env.POLYGON_API_KEY = originalKey;
      }
    });
  });

  describe('GET /api/data/search', () => {
    it('should validate search query', async () => {
      const response = await request(app)
        .get('/api/data/search')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Search query is required');
    });

    it('should accept limit parameter', async () => {
      // This test requires API key to be configured
      if (!process.env.POLYGON_API_KEY) {
        console.log('Skipping search test - no API key configured');
        return;
      }

      const response = await request(app)
        .get('/api/data/search')
        .query({
          query: 'AAPL',
          limit: 5
        });

      if (response.status === 200) {
        expect(response.body.success).toBe(true);
        expect(response.body.data).toBeInstanceOf(Array);
        expect(response.body.data.length).toBeLessThanOrEqual(5);
      }
    });
  });
});