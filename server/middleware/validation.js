function validateBacktestRequest(req, res, next) {
  const { data, strategy } = req.body;
  
  if (!data) {
    return res.status(400).json({
      success: false,
      error: 'Data is required'
    });
  }
  
  if (!data.closes || !Array.isArray(data.closes) || data.closes.length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Data must contain a non-empty closes array'
    });
  }
  
  if (!strategy || !strategy.type) {
    return res.status(400).json({
      success: false,
      error: 'Strategy configuration with type is required'
    });
  }
  
  next();
}

function validateIndicatorRequest(req, res, next) {
  const { type, data } = req.body;
  
  if (!type) {
    return res.status(400).json({
      success: false,
      error: 'Indicator type is required'
    });
  }
  
  if (!data || !Array.isArray(data) || data.length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Data must be a non-empty array'
    });
  }
  
  if (data.some(val => typeof val !== 'number' || isNaN(val))) {
    return res.status(400).json({
      success: false,
      error: 'All data values must be valid numbers'
    });
  }
  
  next();
}

function validateMarketDataRequest(req, res, next) {
  const { symbol, from, to } = req.query;
  
  if (!symbol) {
    return res.status(400).json({
      success: false,
      error: 'Symbol is required'
    });
  }
  
  if (!from || !to) {
    return res.status(400).json({
      success: false,
      error: 'From and to dates are required'
    });
  }
  
  // Validate date format
  const fromDate = new Date(from);
  const toDate = new Date(to);
  
  if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
    return res.status(400).json({
      success: false,
      error: 'Invalid date format. Use YYYY-MM-DD'
    });
  }
  
  if (fromDate >= toDate) {
    return res.status(400).json({
      success: false,
      error: 'From date must be before to date'
    });
  }
  
  next();
}

module.exports = {
  validateBacktestRequest,
  validateIndicatorRequest,
  validateMarketDataRequest
};