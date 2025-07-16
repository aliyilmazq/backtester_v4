import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  DollarSign, 
  Percent, 
  TrendingUp, 
  Shield,
  Info,
  AlertCircle,
  RefreshCw
} from 'lucide-react';

const StepParameterConfig = ({ data, onUpdate, onNext, onPrevious }) => {
  const [parameters, setParameters] = useState({
    strategy: data.strategyParameters || {},
    portfolio: data.portfolioParameters || {
      initialCapital: 100000,
      positionSizing: 'fixed',
      positionSize: 10000,
      maxPositions: 5,
      commission: 0.001,
      slippage: 0.001
    }
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [activeTab, setActiveTab] = useState('strategy');

  // Get default parameters based on selected strategy
  useEffect(() => {
    if (data.strategy && data.strategy.defaultParameters) {
      setParameters(prev => ({
        ...prev,
        strategy: { ...data.strategy.defaultParameters, ...prev.strategy }
      }));
    }
  }, [data.strategy]);

  const validateParameters = () => {
    const errors = {};

    // Validate portfolio parameters
    if (parameters.portfolio.initialCapital < 1000) {
      errors.initialCapital = 'Initial capital must be at least $1,000';
    }

    if (parameters.portfolio.positionSize < 100) {
      errors.positionSize = 'Position size must be at least $100';
    }

    if (parameters.portfolio.positionSize > parameters.portfolio.initialCapital) {
      errors.positionSize = 'Position size cannot exceed initial capital';
    }

    if (parameters.portfolio.maxPositions < 1 || parameters.portfolio.maxPositions > 100) {
      errors.maxPositions = 'Max positions must be between 1 and 100';
    }

    if (parameters.portfolio.commission < 0 || parameters.portfolio.commission > 0.1) {
      errors.commission = 'Commission must be between 0% and 10%';
    }

    if (parameters.portfolio.slippage < 0 || parameters.portfolio.slippage > 0.1) {
      errors.slippage = 'Slippage must be between 0% and 10%';
    }

    // Validate strategy-specific parameters
    Object.entries(parameters.strategy).forEach(([key, value]) => {
      if (value === '' || value === null || value === undefined) {
        errors[`strategy_${key}`] = 'This field is required';
      }
    });

    return errors;
  };

  const handleParameterChange = (category, field, value) => {
    const newParameters = {
      ...parameters,
      [category]: {
        ...parameters[category],
        [field]: value
      }
    };

    setParameters(newParameters);
    setTouched({
      ...touched,
      [`${category}_${field}`]: true
    });

    // Update parent component
    onUpdate({
      strategyParameters: newParameters.strategy,
      portfolioParameters: newParameters.portfolio
    });
  };

  const handleNext = () => {
    const validationErrors = validateParameters();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      onNext();
    }
  };

  const resetToDefaults = () => {
    const defaultParams = {
      strategy: data.strategy?.defaultParameters || {},
      portfolio: {
        initialCapital: 100000,
        positionSizing: 'fixed',
        positionSize: 10000,
        maxPositions: 5,
        commission: 0.001,
        slippage: 0.001
      }
    };

    setParameters(defaultParams);
    setErrors({});
    setTouched({});

    onUpdate({
      strategyParameters: defaultParams.strategy,
      portfolioParameters: defaultParams.portfolio
    });
  };

  const renderStrategyParameters = () => {
    if (!data.strategy) return null;

    const strategyParams = data.strategy.parameterDefinitions || {};

    return (
      <div className="space-y-4">
        {Object.entries(strategyParams).map(([key, config]) => (
          <div key={key}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {config.label}
              {config.description && (
                <span className="ml-1 text-gray-500 font-normal">
                  ({config.description})
                </span>
              )}
            </label>
            <div className="relative">
              <input
                type={config.type || 'number'}
                value={parameters.strategy[key] || ''}
                onChange={(e) => handleParameterChange('strategy', key, 
                  config.type === 'number' ? parseFloat(e.target.value) : e.target.value
                )}
                min={config.min}
                max={config.max}
                step={config.step}
                className={`block w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors[`strategy_${key}`] ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors[`strategy_${key}`] && (
                <p className="mt-1 text-sm text-red-600">{errors[`strategy_${key}`]}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderPortfolioParameters = () => (
    <div className="space-y-4">
      {/* Initial Capital */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Initial Capital
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <DollarSign className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="number"
            value={parameters.portfolio.initialCapital}
            onChange={(e) => handleParameterChange('portfolio', 'initialCapital', parseFloat(e.target.value))}
            min="1000"
            step="1000"
            className={`block w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.initialCapital ? 'border-red-300' : 'border-gray-300'
            }`}
          />
        </div>
        {errors.initialCapital && (
          <p className="mt-1 text-sm text-red-600">{errors.initialCapital}</p>
        )}
      </div>

      {/* Position Sizing */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Position Sizing Method
        </label>
        <select
          value={parameters.portfolio.positionSizing}
          onChange={(e) => handleParameterChange('portfolio', 'positionSizing', e.target.value)}
          className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="fixed">Fixed Amount</option>
          <option value="percentage">Percentage of Portfolio</option>
          <option value="equal">Equal Weight</option>
        </select>
      </div>

      {/* Position Size */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Position Size
          {parameters.portfolio.positionSizing === 'percentage' ? ' (%)' : ' ($)'}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {parameters.portfolio.positionSizing === 'percentage' ? 
              <Percent className="h-5 w-5 text-gray-400" /> :
              <DollarSign className="h-5 w-5 text-gray-400" />
            }
          </div>
          <input
            type="number"
            value={parameters.portfolio.positionSize}
            onChange={(e) => handleParameterChange('portfolio', 'positionSize', parseFloat(e.target.value))}
            min={parameters.portfolio.positionSizing === 'percentage' ? 1 : 100}
            max={parameters.portfolio.positionSizing === 'percentage' ? 100 : undefined}
            step={parameters.portfolio.positionSizing === 'percentage' ? 1 : 100}
            className={`block w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.positionSize ? 'border-red-300' : 'border-gray-300'
            }`}
          />
        </div>
        {errors.positionSize && (
          <p className="mt-1 text-sm text-red-600">{errors.positionSize}</p>
        )}
      </div>

      {/* Max Positions */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Maximum Positions
        </label>
        <input
          type="number"
          value={parameters.portfolio.maxPositions}
          onChange={(e) => handleParameterChange('portfolio', 'maxPositions', parseInt(e.target.value))}
          min="1"
          max="100"
          className={`block w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors.maxPositions ? 'border-red-300' : 'border-gray-300'
          }`}
        />
        {errors.maxPositions && (
          <p className="mt-1 text-sm text-red-600">{errors.maxPositions}</p>
        )}
      </div>

      {/* Commission */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Commission Rate (%)
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Percent className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="number"
            value={(parameters.portfolio.commission * 100).toFixed(2)}
            onChange={(e) => handleParameterChange('portfolio', 'commission', parseFloat(e.target.value) / 100)}
            min="0"
            max="10"
            step="0.01"
            className={`block w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.commission ? 'border-red-300' : 'border-gray-300'
            }`}
          />
        </div>
        {errors.commission && (
          <p className="mt-1 text-sm text-red-600">{errors.commission}</p>
        )}
      </div>

      {/* Slippage */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Slippage (%)
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Percent className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="number"
            value={(parameters.portfolio.slippage * 100).toFixed(2)}
            onChange={(e) => handleParameterChange('portfolio', 'slippage', parseFloat(e.target.value) / 100)}
            min="0"
            max="10"
            step="0.01"
            className={`block w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.slippage ? 'border-red-300' : 'border-gray-300'
            }`}
          />
        </div>
        {errors.slippage && (
          <p className="mt-1 text-sm text-red-600">{errors.slippage}</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Configure Parameters
          </h3>
          <p className="text-sm text-gray-600">
            Customize strategy and portfolio settings
          </p>
        </div>
        <button
          onClick={resetToDefaults}
          className="flex items-center px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <RefreshCw className="h-4 w-4 mr-1" />
          Reset to Defaults
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('strategy')}
          className={`flex-1 flex items-center justify-center px-4 py-2 rounded-md font-medium transition-colors ${
            activeTab === 'strategy'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Settings className="h-4 w-4 mr-2" />
          Strategy Parameters
        </button>
        <button
          onClick={() => setActiveTab('portfolio')}
          className={`flex-1 flex items-center justify-center px-4 py-2 rounded-md font-medium transition-colors ${
            activeTab === 'portfolio'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <DollarSign className="h-4 w-4 mr-2" />
          Portfolio Settings
        </button>
      </div>

      {/* Tab Content */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        {activeTab === 'strategy' ? renderStrategyParameters() : renderPortfolioParameters()}
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <Info className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-gray-700">
            <p className="font-medium mb-1">Parameter Guidelines:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>Commission and slippage simulate real trading costs</li>
              <li>Position sizing determines how much capital to allocate per trade</li>
              <li>Max positions limits concurrent open positions</li>
              <li>Strategy parameters affect signal generation</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <button
          onClick={onPrevious}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default StepParameterConfig;