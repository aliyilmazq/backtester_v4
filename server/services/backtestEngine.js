const indicatorService = require('./indicators/indicatorService');
const metrics = require('./metrics');
const strategies = require('./strategies');

class BacktestEngine {
  constructor() {
    this.strategies = strategies;
    this.metrics = metrics;
  }

  async runBacktest(config) {
    try {
      this.validateConfig(config);
      
      const {
        data,
        strategy: strategyConfig,
        initialCapital = 10000,
        positionSize = 1,
        commission = 0
      } = config;

      // Calculate indicators
      const indicators = await this.calculateIndicators(data, strategyConfig);
      
      // Execute strategy
      const strategyResult = await this.executeStrategy(data, indicators, strategyConfig);
      
      // Calculate portfolio
      const portfolio = await this.calculatePortfolio(
        data,
        strategyResult.positions,
        initialCapital,
        positionSize,
        commission
      );
      
      // Calculate metrics
      const performanceMetrics = await this.calculateMetrics(portfolio);
      
      return {
        success: true,
        data: {
          portfolio,
          positions: strategyResult.positions,
          metrics: performanceMetrics,
          metadata: {
            strategy: strategyResult.metadata,
            dataPoints: data.closes.length,
            initialCapital,
            finalCapital: portfolio.equity[portfolio.equity.length - 1],
            totalReturn: ((portfolio.equity[portfolio.equity.length - 1] - initialCapital) / initialCapital) * 100
          }
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      };
    }
  }

  validateConfig(config) {
    if (!config.data || !config.data.closes) {
      throw new Error('Price data with closes array is required');
    }
    
    if (!config.strategy || !config.strategy.type) {
      throw new Error('Strategy configuration with type is required');
    }
    
    const supportedStrategies = Object.keys(this.strategies);
    if (!supportedStrategies.includes(config.strategy.type)) {
      throw new Error(`Unsupported strategy type: ${config.strategy.type}. Supported: ${supportedStrategies.join(', ')}`);
    }
  }

  async calculateIndicators(data, strategyConfig) {
    const { type, params = {} } = strategyConfig;
    const indicators = {};
    
    switch (type) {
      case 'SMA':
        indicators.sma = indicatorService.calculate('SMA', null, {
          values: data.closes,
          period: params.period || 20
        });
        break;
        
      case 'EMA':
        indicators.ema = indicatorService.calculate('EMA', null, {
          values: data.closes,
          period: params.period || 20
        });
        break;
        
      case 'RSI':
        indicators.rsi = indicatorService.calculate('RSI', null, {
          values: data.closes,
          period: params.period || 14
        });
        break;
        
      case 'MACD':
        indicators.macd = indicatorService.calculate('MACD', null, {
          values: data.closes,
          fastPeriod: params.fastPeriod || 12,
          slowPeriod: params.slowPeriod || 26,
          signalPeriod: params.signalPeriod || 9
        });
        break;
        
      case 'BBANDS':
        indicators.bbands = indicatorService.calculate('BBANDS', null, {
          values: data.closes,
          period: params.period || 20,
          stdDev: params.stdDev || 2
        });
        break;
    }
    
    return indicators;
  }

  async executeStrategy(data, indicators, strategyConfig) {
    const { type, params = {} } = strategyConfig;
    const StrategyClass = this.strategies[type];
    const strategy = new StrategyClass(params);
    
    const strategyData = {
      closes: data.closes,
      ...indicators,
      includeShort: params.includeShort || false
    };
    
    // Map indicator names for strategy execution
    if (type === 'SMA' && indicators.sma) {
      strategyData.smaValues = indicators.sma;
    } else if (type === 'EMA' && indicators.ema) {
      strategyData.emaValues = indicators.ema;
    } else if (type === 'RSI' && indicators.rsi) {
      strategyData.rsiValues = indicators.rsi;
    } else if (type === 'MACD' && indicators.macd) {
      strategyData.macdValues = indicators.macd;
    } else if (type === 'BBANDS' && indicators.bbands) {
      strategyData.bbandsValues = indicators.bbands;
    }
    
    return strategy.execute(strategyData);
  }

  async calculatePortfolio(data, positions, initialCapital, positionSize, commission) {
    const equity = [initialCapital];
    const trades = [];
    let currentPosition = 0;
    let entryPrice = 0;
    let entryIndex = 0;
    
    for (let i = 1; i < positions.length; i++) {
      const prevPosition = positions[i - 1];
      const currPosition = positions[i];
      const price = data.closes[i];
      
      // Position change detected
      if (prevPosition !== currPosition) {
        // Close existing position
        if (currentPosition !== 0) {
          const exitPrice = price;
          const returns = currentPosition * (exitPrice - entryPrice) / entryPrice;
          const pnl = initialCapital * positionSize * returns;
          const commissionCost = initialCapital * positionSize * commission * 2; // Entry + Exit
          
          trades.push({
            entryIndex,
            exitIndex: i,
            entryPrice,
            exitPrice,
            position: currentPosition,
            returns,
            pnl: pnl - commissionCost,
            duration: i - entryIndex
          });
          
          equity[i] = equity[i - 1] + pnl - commissionCost;
        } else {
          equity[i] = equity[i - 1];
        }
        
        // Open new position
        if (currPosition !== 0) {
          currentPosition = currPosition;
          entryPrice = price;
          entryIndex = i;
        } else {
          currentPosition = 0;
        }
      } else {
        // Hold position
        if (currentPosition !== 0) {
          const currentPrice = price;
          const returns = currentPosition * (currentPrice - entryPrice) / entryPrice;
          const pnl = initialCapital * positionSize * returns;
          equity[i] = equity[0] + pnl;
        } else {
          equity[i] = equity[i - 1];
        }
      }
    }
    
    // Calculate returns
    const dailyReturns = [];
    for (let i = 1; i < equity.length; i++) {
      dailyReturns.push((equity[i] - equity[i - 1]) / equity[i - 1]);
    }
    
    return {
      equity,
      trades,
      dailyReturns,
      positions
    };
  }

  async calculateMetrics(portfolio) {
    const { equity, trades, dailyReturns } = portfolio;
    const results = {};
    
    // Calculate Sharpe Ratio
    const sharpeMetric = new this.metrics.SharpeRatio();
    const sharpeResult = sharpeMetric.calculate({ dailyReturns });
    results.sharpeRatio = sharpeResult ? sharpeResult.value : null;
    
    // Calculate Sortino Ratio
    const sortinoMetric = new this.metrics.SortinoRatio();
    const sortinoResult = sortinoMetric.calculate({ dailyReturns });
    results.sortinoRatio = sortinoResult ? sortinoResult.value : null;
    
    // Calculate Max Drawdown
    const maxDrawdownMetric = new this.metrics.MaxDrawdown();
    const maxDrawdownResult = maxDrawdownMetric.calculate({ equityCurve: equity });
    results.maxDrawdown = maxDrawdownResult ? maxDrawdownResult.value : null;
    
    // Calculate Trade Stats
    if (trades.length > 0) {
      const tradeStatsMetric = new this.metrics.TradeStats();
      const tradeStatsResult = tradeStatsMetric.calculate({ 
        trades, 
        prices: equity 
      });
      results.tradeStats = tradeStatsResult ? tradeStatsResult.value : null;
    } else {
      results.tradeStats = {
        tradeCount: 0,
        avgTradeDuration: 0,
        avgTradeReturn: 0,
        tradesPerMonth: 0,
        daysInMarket: 0
      };
    }
    
    return results;
  }
}

module.exports = new BacktestEngine();