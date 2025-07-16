const BaseStrategy = require('./baseStrategy');

class RSIStrategy extends BaseStrategy {
  constructor(config = {}) {
    super('RSI', config);
    this.period = config.period || 14;
    this.oversoldThreshold = config.oversoldThreshold || 30;
    this.overboughtThreshold = config.overboughtThreshold || 70;
  }

  validate(data) {
    if (!data.rsiValues || !Array.isArray(data.rsiValues)) {
      throw new Error('RSI values array is required');
    }
    if (data.rsiValues.length === 0) {
      throw new Error('RSI values array cannot be empty');
    }
    if (this.oversoldThreshold >= this.overboughtThreshold) {
      throw new Error('Oversold threshold must be less than overbought threshold');
    }
  }

  execute(data) {
    this.validate(data);
    
    const { rsiValues, includeShort = false } = data;
    const offset = rsiValues.length;
    const positions = Array(offset).fill(0);
    
    for (let i = 0; i < offset; i++) {
      if (includeShort) {
        if (rsiValues[i] < this.oversoldThreshold) {
          positions[i] = 1;
        } else if (rsiValues[i] > this.overboughtThreshold) {
          positions[i] = -1;
        } else {
          positions[i] = positions[i - 1] || 0;
        }
      } else {
        if (rsiValues[i] < this.oversoldThreshold) {
          positions[i] = 1;
        } else if (rsiValues[i] > this.overboughtThreshold) {
          positions[i] = 0;
        } else {
          positions[i] = positions[i - 1] || 0;
        }
      }
    }
    
    return {
      positions,
      metadata: {
        strategy: this.name,
        period: this.period,
        oversoldThreshold: this.oversoldThreshold,
        overboughtThreshold: this.overboughtThreshold,
        includeShort
      }
    };
  }
}

module.exports = RSIStrategy;