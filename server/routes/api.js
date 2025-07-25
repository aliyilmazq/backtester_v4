const express = require('express');

const router = express.Router();
const backtestController = require('../controllers/backtestController');
const dataController = require('../controllers/dataController');

// Backtest routes
router.post('/backtest/run', backtestController.runBacktest);
router.post('/backtest/indicator', backtestController.calculateIndicator);
router.get('/backtest/strategies', backtestController.getAvailableStrategies);
router.get('/backtest/metrics', backtestController.getAvailableMetrics);

// Data routes
router.get('/data/market', dataController.getMarketData);
router.get('/data/search', dataController.searchSymbols);

// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    version: '1.0.0'
  });
});

module.exports = router;