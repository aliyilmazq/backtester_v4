const puppeteer = require('puppeteer');
const request = require('supertest');

const app = require('../../server/server');

describe('Frontend-Backend Integration Tests', () => {
  let browser;
  // let page;
  // const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
  // const API_URL = process.env.API_URL || 'http://localhost:5001';

  beforeAll(async () => {
    // Launch browser for frontend tests
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    page = await browser.newPage();
  });

  afterAll(async () => {
    if (browser) {
      await browser.close();
    }
  });

  describe('Complete Backtest Flow', () => {
    it('should complete a full backtest workflow', async () => {
      // 1. Test API Health Check
      const healthResponse = await request(app)
        .get('/api/health')
        .expect(200);
      
      expect(healthResponse.body.success).toBe(true);

      // 2. Get available strategies
      const strategiesResponse = await request(app)
        .get('/api/backtest/strategies')
        .expect(200);
      
      expect(strategiesResponse.body.data).toBeInstanceOf(Array);
      const strategies = strategiesResponse.body.data;
      expect(strategies.length).toBeGreaterThan(0);

      // 3. Run backtest with first strategy
      const testStrategy = strategies[0];
      const backtestData = {
        data: {
          closes: generateTestPrices(100)
        },
        strategy: {
          type: testStrategy.type,
          params: testStrategy.parameters.reduce((acc, param) => {
            acc[param.name] = param.default;
            return acc;
          }, {})
        },
        parameters: {
          initialCapital: 10000,
          positionSize: 1,
          commission: 0.001
        }
      };

      const backtestResponse = await request(app)
        .post('/api/backtest/run')
        .send(backtestData)
        .expect(200);

      expect(backtestResponse.body.success).toBe(true);
      expect(backtestResponse.body.data.portfolio).toBeDefined();
      expect(backtestResponse.body.data.metrics).toBeDefined();

      // 4. Get AI feedback for the results
      const aiFeedbackResponse = await request(app)
        .post('/api/ai-feedback')
        .send({ metrics: backtestResponse.body.data.metrics })
        .expect(200);

      expect(aiFeedbackResponse.body).toHaveProperty('feedback');
    });
  });

  describe('Error Handling Flow', () => {
    it('should handle errors gracefully', async () => {
      // Test with insufficient data
      const insufficientData = {
        data: {
          closes: [100, 101] // Too few data points
        },
        strategy: {
          type: 'SMA',
          params: {
            period: 20 // Period larger than data
          }
        }
      };

      const response = await request(app)
        .post('/api/backtest/run')
        .send(insufficientData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });
  });

  describe('Concurrent Requests', () => {
    it('should handle multiple concurrent backtest requests', async () => {
      const createBacktestRequest = (strategyType) => ({
        data: {
          closes: generateTestPrices(50)
        },
        strategy: {
          type: strategyType,
          params: {}
        },
        parameters: {
          initialCapital: 10000
        }
      });

      // Send multiple concurrent requests
      const promises = ['SMA', 'EMA', 'RSI'].map(strategy =>
        request(app)
          .post('/api/backtest/run')
          .send(createBacktestRequest(strategy))
      );

      const responses = await Promise.all(promises);
      
      responses.forEach(response => {
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
      });
    });
  });

  describe('Data Validation', () => {
    it('should validate all required fields', async () => {
      const invalidRequests = [
        { data: null, strategy: { type: 'SMA' } },
        { data: { closes: [] }, strategy: { type: 'SMA' } },
        { data: { closes: [100] }, strategy: null },
        { data: { closes: [100] }, strategy: { type: null } }
      ];

      for (const invalidRequest of invalidRequests) {
        const response = await request(app)
          .post('/api/backtest/run')
          .send(invalidRequest)
          .expect(400);

        expect(response.body.success).toBe(false);
        expect(response.body.error).toBeDefined();
      }
    });
  });
});

// Helper function to generate test price data
function generateTestPrices(count) {
  const prices = [];
  let basePrice = 100;
  
  for (let i = 0; i < count; i++) {
    // Generate random walk
    const change = (Math.random() - 0.5) * 2;
    basePrice += change;
    prices.push(Math.max(basePrice, 1)); // Ensure positive prices
  }
  
  return prices;
}