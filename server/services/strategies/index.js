const BaseStrategy = require('./baseStrategy');
const SMAStrategy = require('./smaStrategy');
const EMAStrategy = require('./emaStrategy');
const RSIStrategy = require('./rsiStrategy');
const MACDStrategy = require('./macdStrategy');
const BollingerBandsStrategy = require('./bbandsStrategy');

module.exports = {
  BaseStrategy,
  SMAStrategy,
  EMAStrategy,
  RSIStrategy,
  MACDStrategy,
  BollingerBandsStrategy
};