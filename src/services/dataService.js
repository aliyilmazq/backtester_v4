import api from './api';

class DataService {
  async getMarketData(symbol, from, to, timeframe = '1Day') {
    const response = await api.get('/data/market', {
      symbol,
      from,
      to,
      timeframe
    });
    return response.data;
  }

  async searchSymbols(query, limit = 10) {
    const response = await api.get('/data/search', {
      query,
      limit
    });
    return response.data;
  }

  formatDateForAPI(date) {
    return date.toISOString().split('T')[0];
  }

  validateDateRange(from, to) {
    const fromDate = new Date(from);
    const toDate = new Date(to);
    
    if (fromDate >= toDate) {
      throw new Error('Start date must be before end date');
    }
    
    const daysDiff = (toDate - fromDate) / (1000 * 60 * 60 * 24);
    if (daysDiff > 730) { // 2 years
      throw new Error('Date range cannot exceed 2 years');
    }
    
    return true;
  }
}

export default new DataService();