const backtestEngine = require('../services/backtestEngine');
const indicatorService = require('../services/indicators/indicatorService');

class BacktestController {
  async runBacktest(req, res) {
    try {
      const { data, strategy, parameters } = req.body;
      
      if (!data || !strategy) {
        return res.status(400).json({
          success: false,
          error: 'Data and strategy are required'
        });
      }

      const config = {
        data,
        strategy,
        ...parameters
      };

      const result = await backtestEngine.runBacktest(config);
      
      if (result.success) {
        res.json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error('Backtest error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: error.message
      });
    }
  }

  async calculateIndicator(req, res) {
    try {
      const { type, data, params } = req.body;
      
      if (!type || !data) {
        return res.status(400).json({
          success: false,
          error: 'Indicator type and data are required'
        });
      }

      indicatorService.validateData(data);
      const result = indicatorService.calculate(type, null, { values: data, ...params });
      
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Indicator calculation error:', error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async getAvailableStrategies(req, res) {
    try {
      const strategies = Object.keys(backtestEngine.strategies).map(key => ({
        type: key,
        name: key,
        parameters: getStrategyParameters(key)
      }));
      
      res.json({
        success: true,
        data: strategies
      });
    } catch (error) {
      console.error('Get strategies error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get available strategies'
      });
    }
  }

  async getAvailableMetrics(req, res) {
    try {
      const metrics = Object.keys(backtestEngine.metrics).map(key => ({
        type: key,
        name: key.replace(/([A-Z])/g, ' $1').trim()
      }));
      
      res.json({
        success: true,
        data: metrics
      });
    } catch (error) {
      console.error('Get metrics error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get available metrics'
      });
    }
  }
}

function getStrategyParameters(strategyType) {
  const params = {
    SMA: [
      { name: 'period', type: 'number', default: 20, min: 1, max: 200 },
      { name: 'includeShort', type: 'boolean', default: false }
    ],
    EMA: [
      { name: 'period', type: 'number', default: 20, min: 1, max: 200 },
      { name: 'includeShort', type: 'boolean', default: false }
    ],
    RSI: [
      { name: 'period', type: 'number', default: 14, min: 2, max: 100 },
      { name: 'oversoldThreshold', type: 'number', default: 30, min: 0, max: 100 },
      { name: 'overboughtThreshold', type: 'number', default: 70, min: 0, max: 100 },
      { name: 'includeShort', type: 'boolean', default: false }
    ],
    MACD: [
      { name: 'fastPeriod', type: 'number', default: 12, min: 1, max: 50 },
      { name: 'slowPeriod', type: 'number', default: 26, min: 1, max: 100 },
      { name: 'signalPeriod', type: 'number', default: 9, min: 1, max: 50 },
      { name: 'includeShort', type: 'boolean', default: false }
    ],
    BBANDS: [
      { name: 'period', type: 'number', default: 20, min: 1, max: 200 },
      { name: 'stdDev', type: 'number', default: 2, min: 0.1, max: 5 },
      { name: 'includeShort', type: 'boolean', default: false }
    ]
  };
  
  return params[strategyType] || [];
}

module.exports = new BacktestController();