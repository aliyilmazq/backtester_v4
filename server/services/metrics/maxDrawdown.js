const BaseMetric = require('./baseMetric');

class MaxDrawdown extends BaseMetric {
  constructor(config = {}) {
    super('Maximum Drawdown', config);
  }

  validate(data) {
    if (!data.equityCurve || !Array.isArray(data.equityCurve)) {
      throw new Error('Equity curve array is required');
    }
    if (data.equityCurve.length === 0) {
      throw new Error('Equity curve array cannot be empty');
    }
    if (data.equityCurve.some(value => typeof value !== 'number' || value < 0)) {
      throw new Error('Equity curve must contain only positive numbers');
    }
  }

  calculate(data) {
    this.validate(data);
    
    const { equityCurve } = data;
    
    if (equityCurve.length === 0) {
      return null;
    }
    
    let peak = equityCurve[0];
    let maxDrawdown = 0;
    let maxDrawdownStartIdx = 0;
    let maxDrawdownEndIdx = 0;
    let currentPeakIdx = 0;
    
    for (let i = 0; i < equityCurve.length; i++) {
      const value = equityCurve[i];
      
      if (value > peak) {
        peak = value;
        currentPeakIdx = i;
      }
      
      const drawdown = (peak - value) / peak;
      
      if (drawdown > maxDrawdown) {
        maxDrawdown = drawdown;
        maxDrawdownStartIdx = currentPeakIdx;
        maxDrawdownEndIdx = i;
      }
    }
    
    // Calculate drawdown duration
    const drawdownDuration = maxDrawdownEndIdx - maxDrawdownStartIdx;
    
    return {
      value: maxDrawdown,
      metadata: {
        metric: this.name,
        maxDrawdownPercentage: maxDrawdown * 100,
        drawdownStartIndex: maxDrawdownStartIdx,
        drawdownEndIndex: maxDrawdownEndIdx,
        drawdownDuration: drawdownDuration,
        peakValue: equityCurve[maxDrawdownStartIdx] || peak,
        troughValue: equityCurve[maxDrawdownEndIdx] || equityCurve[equityCurve.length - 1],
        dataPoints: equityCurve.length
      }
    };
  }
}

module.exports = MaxDrawdown;