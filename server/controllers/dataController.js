const axios = require('axios');

class DataController {
  async getMarketData(req, res) {
    try {
      const { symbol, from, to, timeframe = '1Day' } = req.query;
      
      if (!symbol || !from || !to) {
        return res.status(400).json({
          success: false,
          error: 'Symbol, from, and to parameters are required'
        });
      }

      const apiKey = process.env.POLYGON_API_KEY;
      if (!apiKey) {
        return res.status(500).json({
          success: false,
          error: 'Polygon API key not configured'
        });
      }

      const url = `https://api.polygon.io/v2/aggs/ticker/${symbol}/range/1/${timeframe}/${from}/${to}?apiKey=${apiKey}`;
      
      const response = await axios.get(url);
      
      if (response.data.status !== 'OK') {
        throw new Error(response.data.message || 'Failed to fetch data from Polygon');
      }

      // Transform data for backtesting
      const data = {
        symbol,
        timeframe,
        dates: [],
        opens: [],
        highs: [],
        lows: [],
        closes: [],
        volumes: []
      };

      if (response.data.results && response.data.results.length > 0) {
        response.data.results.forEach(bar => {
          data.dates.push(new Date(bar.t));
          data.opens.push(bar.o);
          data.highs.push(bar.h);
          data.lows.push(bar.l);
          data.closes.push(bar.c);
          data.volumes.push(bar.v);
        });
      }

      res.json({
        success: true,
        data,
        metadata: {
          resultsCount: response.data.resultsCount,
          ticker: response.data.ticker,
          queryCount: response.data.queryCount
        }
      });
    } catch (error) {
      console.error('Market data fetch error:', error);
      
      if (error.response && error.response.status === 403) {
        return res.status(403).json({
          success: false,
          error: 'Invalid API key or unauthorized access'
        });
      }
      
      res.status(500).json({
        success: false,
        error: 'Failed to fetch market data',
        message: error.message
      });
    }
  }

  async searchSymbols(req, res) {
    try {
      const { query, limit = 10 } = req.query;
      
      if (!query) {
        return res.status(400).json({
          success: false,
          error: 'Search query is required'
        });
      }

      const apiKey = process.env.POLYGON_API_KEY;
      if (!apiKey) {
        return res.status(500).json({
          success: false,
          error: 'Polygon API key not configured'
        });
      }

      const url = `https://api.polygon.io/v3/reference/tickers?search=${query}&limit=${limit}&apiKey=${apiKey}`;
      
      const response = await axios.get(url);
      
      if (response.data.status !== 'OK') {
        throw new Error(response.data.message || 'Failed to search symbols');
      }

      const symbols = response.data.results.map(ticker => ({
        symbol: ticker.ticker,
        name: ticker.name,
        market: ticker.market,
        locale: ticker.locale,
        type: ticker.type,
        currency: ticker.currency_name
      }));

      res.json({
        success: true,
        data: symbols,
        count: response.data.count
      });
    } catch (error) {
      console.error('Symbol search error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to search symbols',
        message: error.message
      });
    }
  }
}

module.exports = new DataController();