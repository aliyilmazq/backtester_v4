const BaseStrategy = require('./baseStrategy');

class BollingerBandsStrategy extends BaseStrategy {
  constructor(config = {}) {
    super('BollingerBands', config);
    this.period = config.period || 20;
    this.stdDev = config.stdDev || 2;
  }

  validate(data) {
    if (!data.closes || !Array.isArray(data.closes)) {
      throw new Error('Closes array is required');
    }
    if (!data.bbandsValues || !Array.isArray(data.bbandsValues)) {
      throw new Error('Bollinger Bands values array is required');
    }
    if (data.closes.length < this.period) {
      throw new Error(`Insufficient data: need at least ${this.period} periods`);
    }
    // Validate that each bbands value has the required properties
    if (data.bbandsValues.length > 0) {
      const firstValue = data.bbandsValues[0];
      if (!firstValue || typeof firstValue.upper === 'undefined' || typeof firstValue.lower === 'undefined') {
        throw new Error('Bollinger Bands values must contain upper and lower properties');
      }
    }
  }

  execute(data) {
    this.validate(data);
    
    const { closes, bbandsValues, includeShort = false } = data;
    const offset = closes.length - bbandsValues.length;
    const positions = Array(closes.length).fill(0);
    
    for (let i = offset; i < closes.length; i++) {
      if (includeShort) {
        if (closes[i] < bbandsValues[i - offset].lower) {
          positions[i] = 1;
        } else if (closes[i] > bbandsValues[i - offset].upper) {
          positions[i] = -1;
        } else {
          positions[i] = positions[i - 1] || 0;
        }
      } else {
        if (closes[i] < bbandsValues[i - offset].lower) {
          positions[i] = 1;
        } else if (closes[i] > bbandsValues[i - offset].upper) {
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
        stdDev: this.stdDev,
        includeShort
      }
    };
  }
}

module.exports = BollingerBandsStrategy;