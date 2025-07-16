const BaseStrategy = require('./baseStrategy');

class MACDStrategy extends BaseStrategy {
  constructor(config = {}) {
    super('MACD', config);
    this.fastPeriod = config.fastPeriod || 12;
    this.slowPeriod = config.slowPeriod || 26;
    this.signalPeriod = config.signalPeriod || 9;
  }

  validate(data) {
    if (!data.macdValues || !Array.isArray(data.macdValues)) {
      throw new Error('MACD values array is required');
    }
    if (data.macdValues.length === 0) {
      throw new Error('MACD values array cannot be empty');
    }
    // Validate that each MACD value has the required properties
    const firstValue = data.macdValues[0];
    if (!firstValue || typeof firstValue.MACD === 'undefined' || typeof firstValue.signal === 'undefined') {
      throw new Error('MACD values must contain MACD and signal properties');
    }
  }

  execute(data) {
    this.validate(data);
    
    const { macdValues, includeShort = false } = data;
    const offset = macdValues.length;
    const positions = Array(offset).fill(0);
    
    for (let i = 0; i < offset; i++) {
      if (includeShort) {
        positions[i] = macdValues[i].MACD > macdValues[i].signal ? 1 : 
                      macdValues[i].MACD < macdValues[i].signal ? -1 : 0;
      } else {
        positions[i] = macdValues[i].MACD > macdValues[i].signal ? 1 : 0;
      }
    }
    
    return {
      positions,
      metadata: {
        strategy: this.name,
        fastPeriod: this.fastPeriod,
        slowPeriod: this.slowPeriod,
        signalPeriod: this.signalPeriod,
        includeShort
      }
    };
  }
}

module.exports = MACDStrategy;