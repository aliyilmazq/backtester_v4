// API Configuration
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const POLYGON_API_KEY = process.env.REACT_APP_POLYGON_API_KEY || '';

export const config = {
  API_URL,
  POLYGON_API_KEY,
  endpoints: {
    backtest: `${API_URL}/api/backtest/run`,
    marketData: `${API_URL}/api/data/market`,
    searchSymbols: `${API_URL}/api/data/search`,
    aiFeedback: `${API_URL}/api/ai-feedback`,
    health: `${API_URL}/api/health`,
  },
};

export default config;
