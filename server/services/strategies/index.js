const BaseStrategy = require('./baseStrategy');
const BollingerBandsStrategy = require('./bbandsStrategy');
const EMAStrategy = require('./emaStrategy');
const MACDStrategy = require('./macdStrategy');
const RSIStrategy = require('./rsiStrategy');
const SMAStrategy = require('./smaStrategy');

module.exports = {
  BaseStrategy,
  SMAStrategy,
  EMAStrategy,
  RSIStrategy,
  MACDStrategy,
  BollingerBandsStrategy
};