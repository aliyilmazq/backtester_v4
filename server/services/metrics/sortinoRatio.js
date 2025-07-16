const BaseMetric = require('./baseMetric');

class SortinoRatio extends BaseMetric {
  constructor(config = {}) {
    super('Sortino Ratio', config);
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
    
    // Calculate downside deviation (only negative returns)
    const negativeReturns = dailyReturns.filter(r => r < 0);
    
    if (negativeReturns.length === 0) {
      // No negative returns, Sortino ratio is undefined
      return {
        value: null,
        metadata: {
          metric: this.name,
          annualizationFactor: this.annualizationFactor,
          meanReturn: mean,
          downsideDeviation: 0,
          negativeReturns: 0,
          dataPoints: dailyReturns.length
        }
      };
    }
    
    const downsideVariance = dailyReturns
      .filter(r => r < 0)
      .reduce((a, b) => a + Math.pow(b - mean, 2), 0) / dailyReturns.length;
    
    const downsideStd = Math.sqrt(downsideVariance);
    
    if (downsideStd === 0) {
      return {
        value: null,
        metadata: {
          metric: this.name,
          annualizationFactor: this.annualizationFactor,
          meanReturn: mean,
          downsideDeviation: 0,
          negativeReturns: negativeReturns.length,
          dataPoints: dailyReturns.length
        }
      };
    }
    
    const sortinoRatio = (mean / downsideStd) * Math.sqrt(this.annualizationFactor);
    
    return {
      value: sortinoRatio,
      metadata: {
        metric: this.name,
        annualizationFactor: this.annualizationFactor,
        meanReturn: mean,
        downsideDeviation: downsideStd,
        negativeReturns: negativeReturns.length,
        dataPoints: dailyReturns.length
      }
    };
  }
}

module.exports = SortinoRatio;