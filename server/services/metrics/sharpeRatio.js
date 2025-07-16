const BaseMetric = require('./baseMetric');

class SharpeRatio extends BaseMetric {
  constructor(config = {}) {
    super('Sharpe Ratio', config);
    this.annualizationFactor = config.annualizationFactor || 252;
  }

  validate(data) {
    if (!data.dailyReturns || !Array.isArray(data.dailyReturns)) {
      throw new Error('Daily returns array is required');
    }
    if (data.dailyReturns.length === 0) {
      throw new Error('Daily returns array cannot be empty');
    }
  }

  calculate(data) {
    this.validate(data);
    
    const { dailyReturns } = data;
    
    if (dailyReturns.length === 0) {
      return null;
    }
    
    const mean = dailyReturns.reduce((a, b) => a + b, 0) / dailyReturns.length;
    const variance = dailyReturns.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / dailyReturns.length;
    const std = Math.sqrt(variance);
    
    if (std === 0) {
      return null;
    }
    
    const sharpeRatio = (mean / std) * Math.sqrt(this.annualizationFactor);
    
    return {
      value: sharpeRatio,
      metadata: {
        metric: this.name,
        annualizationFactor: this.annualizationFactor,
        meanReturn: mean,
        standardDeviation: std,
        dataPoints: dailyReturns.length
      }
    };
  }
}

module.exports = SharpeRatio;