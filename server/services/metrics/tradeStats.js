const BaseMetric = require('./baseMetric');

class TradeStats extends BaseMetric {
  constructor(config = {}) {
    super('Trade Statistics', config);
  }

  validate(data) {
    if (!data.trades || !Array.isArray(data.trades)) {
      throw new Error('Trades array is required');
    }
    if (!data.priceData || !Array.isArray(data.priceData)) {
      throw new Error('Price data array is required');
    }
    if (data.priceData.length < 2) {
      throw new Error('Price data must contain at least 2 data points');
    }
    
    // Validate trade structure
    for (const trade of data.trades) {
      if (typeof trade.duration !== 'number' || trade.duration < 0) {
        throw new Error('Each trade must have a valid duration (non-negative number)');
      }
      if (typeof trade.return !== 'number') {
        throw new Error('Each trade must have a valid return value');
      }
    }
    
    // Validate price data structure
    for (const pricePoint of data.priceData) {
      if (!pricePoint.t || !(pricePoint.t instanceof Date || typeof pricePoint.t === 'string' || typeof pricePoint.t === 'number')) {
        throw new Error('Each price data point must have a valid timestamp (t)');
      }
    }
  }

  calculate(data) {
    this.validate(data);
    
    const { trades, priceData } = data;
    
    const tradeCount = trades.length;
    
    if (tradeCount === 0) {
      return {
        value: {
          tradeCount: 0,
          avgTradeDuration: null,
          avgTradeReturn: null,
          avgTradesPerMonth: null,
          daysInMarket: 0
        },
        metadata: {
          metric: this.name,
          totalTradingDays: priceData.length,
          winningTrades: 0,
          losingTrades: 0,
          winRate: null,
          totalReturn: 0,
          bestTrade: null,
          worstTrade: null
        }
      };
    }
    
    // Calculate basic stats
    const totalDuration = trades.reduce((sum, trade) => sum + trade.duration, 0);
    const totalReturn = trades.reduce((sum, trade) => sum + trade.return, 0);
    const avgTradeDuration = totalDuration / tradeCount;
    const avgTradeReturn = totalReturn / tradeCount;
    const daysInMarket = totalDuration;
    
    // Calculate time period in months
    const startDate = new Date(priceData[0].t);
    const endDate = new Date(priceData[priceData.length - 1].t);
    const timeDiffMs = endDate - startDate;
    const months = timeDiffMs / (1000 * 60 * 60 * 24 * 30.44);
    const avgTradesPerMonth = months > 0 ? tradeCount / months : null;
    
    // Calculate additional statistics
    const winningTrades = trades.filter(t => t.return > 0);
    const losingTrades = trades.filter(t => t.return < 0);
    const winRate = tradeCount > 0 ? winningTrades.length / tradeCount : null;
    
    // Find best and worst trades
    const sortedByReturn = [...trades].sort((a, b) => b.return - a.return);
    const bestTrade = sortedByReturn[0] || null;
    const worstTrade = sortedByReturn[sortedByReturn.length - 1] || null;
    
    return {
      value: {
        tradeCount,
        avgTradeDuration,
        avgTradeReturn,
        avgTradesPerMonth,
        daysInMarket
      },
      metadata: {
        metric: this.name,
        totalTradingDays: priceData.length,
        winningTrades: winningTrades.length,
        losingTrades: losingTrades.length,
        winRate,
        totalReturn,
        bestTrade: bestTrade ? {
          return: bestTrade.return,
          duration: bestTrade.duration
        } : null,
        worstTrade: worstTrade ? {
          return: worstTrade.return,
          duration: worstTrade.duration
        } : null,
        avgWinReturn: winningTrades.length > 0 
          ? winningTrades.reduce((sum, t) => sum + t.return, 0) / winningTrades.length 
          : null,
        avgLossReturn: losingTrades.length > 0 
          ? losingTrades.reduce((sum, t) => sum + t.return, 0) / losingTrades.length 
          : null
      }
    };
  }
}

module.exports = TradeStats;