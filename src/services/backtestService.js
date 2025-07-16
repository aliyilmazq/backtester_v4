import api from './api';

class BacktestService {
  async runBacktest(config) {
    const response = await api.post('/backtest/run', config);
    return response.data;
  }

  async calculateIndicator(type, data, params = {}) {
    const response = await api.post('/backtest/indicator', {
      type,
      data,
      params
    });
    return response.data;
  }

  async getAvailableStrategies() {
    const response = await api.get('/backtest/strategies');
    return response.data;
  }

  async getAvailableMetrics() {
    const response = await api.get('/backtest/metrics');
    return response.data;
  }

  async getAIFeedback(metrics) {
    const response = await api.post('/ai-feedback', { metrics });
    return response.feedback;
  }
}

export default new BacktestService();