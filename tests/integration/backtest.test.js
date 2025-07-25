const request = require('supertest');

const app = require('../../server/server');

describe('Backtest API Integration Tests', () => {
  describe('POST /api/backtest/run', () => {
    it('should run a successful backtest with SMA strategy', async () => {
      const testData = {
        data: {
          closes: [100, 102, 101, 103, 105, 104, 106, 108, 107, 109, 
                   111, 110, 112, 114, 113, 115, 117, 116, 118, 120,
                   119, 121, 123, 122, 124, 126, 125, 127, 129, 128]
        },
        strategy: {
          type: 'SMA',
          params: {
            period: 10,
            includeShort: false
          }
        },
        parameters: {
          initialCapital: 10000,
          positionSize: 1,
          commission: 0.001
        }
      };

      const response = await request(app)
        .post('/api/backtest/run')
        .send(testData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('portfolio');
      expect(response.body.data).toHaveProperty('positions');
      expect(response.body.data).toHaveProperty('metrics');
      expect(response.body.data.metrics).toHaveProperty('sharpeRatio');
      expect(response.body.data.metrics).toHaveProperty('maxDrawdown');
    });

    it('should return error for missing data', async () => {
      const response = await request(app)
        .post('/api/backtest/run')
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });

    it('should return error for invalid strategy type', async () => {
      const testData = {
        data: {
          closes: [100, 102, 101, 103, 105]
        },
        strategy: {
          type: 'INVALID_STRATEGY'
        }
      };

      const response = await request(app)
        .post('/api/backtest/run')
        .send(testData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Unsupported strategy type');
    });
  });

  describe('GET /api/backtest/strategies', () => {
    it('should return available strategies', async () => {
      const response = await request(app)
        .get('/api/backtest/strategies')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBeGreaterThan(0);
      
      const strategy = response.body.data[0];
      expect(strategy).toHaveProperty('type');
      expect(strategy).toHaveProperty('name');
      expect(strategy).toHaveProperty('parameters');
    });
  });

  describe('GET /api/backtest/metrics', () => {
    it('should return available metrics', async () => {
      const response = await request(app)
        .get('/api/backtest/metrics')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBeGreaterThan(0);
      
      const metric = response.body.data[0];
      expect(metric).toHaveProperty('type');
      expect(metric).toHaveProperty('name');
    });
  });

  describe('POST /api/backtest/indicator', () => {
    it('should calculate SMA indicator', async () => {
      const testData = {
        type: 'SMA',
        data: [100, 102, 101, 103, 105, 104, 106, 108, 107, 109],
        params: {
          period: 3
        }
      };

      const response = await request(app)
        .post('/api/backtest/indicator')
        .send(testData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    it('should return error for invalid indicator data', async () => {
      const testData = {
        type: 'SMA',
        data: ['invalid', 'data'],
        params: {
          period: 3
        }
      };

      const response = await request(app)
        .post('/api/backtest/indicator')
        .send(testData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('must be valid numbers');
    });
  });
});