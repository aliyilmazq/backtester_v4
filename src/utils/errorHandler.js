export class BacktestError extends Error {
  constructor(message, code, details = {}) {
    super(message);
    this.name = 'BacktestError';
    this.code = code;
    this.details = details;
    this.timestamp = new Date().toISOString();
  }
}

export const ErrorCodes = {
  // Data errors
  INVALID_SYMBOL: 'INVALID_SYMBOL',
  INVALID_DATE_RANGE: 'INVALID_DATE_RANGE',
  INSUFFICIENT_DATA: 'INSUFFICIENT_DATA',
  DATA_FETCH_FAILED: 'DATA_FETCH_FAILED',
  
  // Strategy errors
  INVALID_STRATEGY: 'INVALID_STRATEGY',
  STRATEGY_EXECUTION_FAILED: 'STRATEGY_EXECUTION_FAILED',
  INVALID_PARAMETERS: 'INVALID_PARAMETERS',
  
  // Calculation errors
  INDICATOR_CALCULATION_FAILED: 'INDICATOR_CALCULATION_FAILED',
  METRIC_CALCULATION_FAILED: 'METRIC_CALCULATION_FAILED',
  
  // Network errors
  NETWORK_ERROR: 'NETWORK_ERROR',
  API_KEY_MISSING: 'API_KEY_MISSING',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  
  // Validation errors
  VALIDATION_FAILED: 'VALIDATION_FAILED',
  MISSING_REQUIRED_FIELD: 'MISSING_REQUIRED_FIELD',
  INVALID_FIELD_TYPE: 'INVALID_FIELD_TYPE'
};

export function handleApiError(error) {
  console.error('API Error:', error);
  
  if (error.response) {
    // Server responded with error
    const status = error.response.status;
    const data = error.response.data;
    
    switch (status) {
      case 400:
        return new BacktestError(
          data.error || 'Invalid request',
          ErrorCodes.VALIDATION_FAILED,
          { originalError: data }
        );
      
      case 401:
        return new BacktestError(
          'Authentication failed',
          ErrorCodes.API_KEY_MISSING,
          { originalError: data }
        );
      
      case 403:
        return new BacktestError(
          'Access denied',
          ErrorCodes.API_KEY_MISSING,
          { originalError: data }
        );
      
      case 429:
        return new BacktestError(
          'Rate limit exceeded. Please try again later.',
          ErrorCodes.RATE_LIMIT_EXCEEDED,
          { originalError: data }
        );
      
      case 500:
        return new BacktestError(
          'Server error. Please try again later.',
          ErrorCodes.NETWORK_ERROR,
          { originalError: data }
        );
      
      default:
        return new BacktestError(
          data.error || 'An unexpected error occurred',
          ErrorCodes.NETWORK_ERROR,
          { status, originalError: data }
        );
    }
  } else if (error.request) {
    // Request made but no response
    return new BacktestError(
      'Network error. Please check your connection.',
      ErrorCodes.NETWORK_ERROR,
      { originalError: error.message }
    );
  } else {
    // Something else happened
    return new BacktestError(
      error.message || 'An unexpected error occurred',
      ErrorCodes.VALIDATION_FAILED,
      { originalError: error }
    );
  }
}

export function formatErrorForUser(error) {
  if (error instanceof BacktestError) {
    switch (error.code) {
      case ErrorCodes.INVALID_SYMBOL:
        return 'The selected symbol is invalid. Please choose a valid stock symbol.';
      
      case ErrorCodes.INVALID_DATE_RANGE:
        return 'The selected date range is invalid. Please ensure the start date is before the end date.';
      
      case ErrorCodes.INSUFFICIENT_DATA:
        return 'Not enough data available for the selected period. Please choose a different date range.';
      
      case ErrorCodes.DATA_FETCH_FAILED:
        return 'Failed to fetch market data. Please try again later.';
      
      case ErrorCodes.INVALID_STRATEGY:
        return 'The selected strategy is invalid. Please choose a different strategy.';
      
      case ErrorCodes.STRATEGY_EXECUTION_FAILED:
        return 'Failed to execute the strategy. Please check your parameters and try again.';
      
      case ErrorCodes.INVALID_PARAMETERS:
        return 'Invalid strategy parameters. Please check your inputs.';
      
      case ErrorCodes.NETWORK_ERROR:
        return 'Network connection error. Please check your internet connection.';
      
      case ErrorCodes.API_KEY_MISSING:
        return 'API authentication failed. Please contact support.';
      
      case ErrorCodes.RATE_LIMIT_EXCEEDED:
        return 'Too many requests. Please wait a moment and try again.';
      
      default:
        return error.message;
    }
  }
  
  return 'An unexpected error occurred. Please try again.';
}