const SMA = require('technicalindicators').SMA;
const EMA = require('technicalindicators').EMA;
const RSI = require('technicalindicators').RSI;
const MACD = require('technicalindicators').MACD;
const BollingerBands = require('technicalindicators').BollingerBands;

class IndicatorService {
  constructor() {
    this.indicators = {
      SMA: this.calculateSMA,
      EMA: this.calculateEMA,
      RSI: this.calculateRSI,
      MACD: this.calculateMACD,
      BBANDS: this.calculateBollingerBands
    };
  }

  calculateSMA(data, params) {
    const { values, period = 20 } = params;
    if (!values || values.length < period) {
      throw new Error(`Insufficient data for SMA calculation. Need at least ${period} values`);
    }
    
    return SMA.calculate({
      period,
      values
    });
  }

  calculateEMA(data, params) {
    const { values, period = 20 } = params;
    if (!values || values.length < period) {
      throw new Error(`Insufficient data for EMA calculation. Need at least ${period} values`);
    }
    
    return EMA.calculate({
      period,
      values
    });
  }

  calculateRSI(data, params) {
    const { values, period = 14 } = params;
    if (!values || values.length < period + 1) {
      throw new Error(`Insufficient data for RSI calculation. Need at least ${period + 1} values`);
    }
    
    return RSI.calculate({
      period,
      values
    });
  }

  calculateMACD(data, params) {
    const { values, fastPeriod = 12, slowPeriod = 26, signalPeriod = 9 } = params;
    const minRequired = Math.max(fastPeriod, slowPeriod) + signalPeriod;
    
    if (!values || values.length < minRequired) {
      throw new Error(`Insufficient data for MACD calculation. Need at least ${minRequired} values`);
    }
    
    return MACD.calculate({
      values,
      fastPeriod,
      slowPeriod,
      signalPeriod,
      SimpleMAOscillator: false,
      SimpleMASignal: false
    });
  }

  calculateBollingerBands(data, params) {
    const { values, period = 20, stdDev = 2 } = params;
    if (!values || values.length < period) {
      throw new Error(`Insufficient data for Bollinger Bands calculation. Need at least ${period} values`);
    }
    
    return BollingerBands.calculate({
      period,
      values,
      stdDev
    });
  }

  calculate(indicatorType, data, params) {
    const calculator = this.indicators[indicatorType];
    if (!calculator) {
      throw new Error(`Unsupported indicator type: ${indicatorType}`);
    }
    
    return calculator.call(this, data, params);
  }

  validateData(data) {
    if (!data || !Array.isArray(data)) {
      throw new Error('Data must be an array');
    }
    
    if (data.length === 0) {
      throw new Error('Data array cannot be empty');
    }
    
    if (data.some(val => typeof val !== 'number' || isNaN(val))) {
      throw new Error('All data values must be valid numbers');
    }
    
    return true;
  }
}

module.exports = new IndicatorService();