const BaseStrategy = require('./baseStrategy');

class EMAStrategy extends BaseStrategy {
  constructor(config = {}) {
    super('EMA', config);
    this.period = config.period || 20;
  }

  validate(data) {
    if (!data.closes || !Array.isArray(data.closes)) {
      throw new Error('Closes array is required');
    }
    if (!data.emaValues || !Array.isArray(data.emaValues)) {
      throw new Error('EMA values array is required');
    }
    if (data.closes.length < this.period) {
      throw new Error(`Insufficient data: need at least ${this.period} periods`);
    }
  }

  execute(data) {
    this.validate(data);
    
    const { closes, emaValues, includeShort = false } = data;
    const offset = closes.length - emaValues.length;
    const positions = Array(closes.length).fill(0);
    
    for (let i = offset; i < closes.length; i++) {
      if (includeShort) {
        positions[i] = closes[i] > emaValues[i - offset] ? 1 : closes[i] < emaValues[i - offset] ? -1 : 0;
      } else {
        positions[i] = closes[i] > emaValues[i - offset] ? 1 : 0;
      }
    }
    
    return {
      positions,
      metadata: {
        strategy: this.name,
        period: this.period,
        includeShort
      }
    };
  }
}

module.exports = EMAStrategy;