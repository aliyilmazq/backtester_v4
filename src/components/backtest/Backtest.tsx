import React, { useState } from 'react';
import { Info, TestTube } from 'lucide-react';
import BacktestForm from './BacktestForm';
import BacktestResults from './BacktestResults';
import { BacktestResult } from '../../types';

const Backtest: React.FC = () => {
  const [results, setResults] = useState<BacktestResult | null>(null);

  const handleBacktestComplete = (result: BacktestResult) => {
    setResults(result);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Strategy Backtesting</h2>
          <p className="text-gray-600 mt-1">Test your strategies against historical market data</p>
        </div>
      </div>

      {/* Configuration Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Test Configuration</h3>
          <BacktestForm onComplete={handleBacktestComplete} />
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Test Guidelines</h3>
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Info size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Best Practices</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Use at least 3 years of historical data for reliable results</li>
                    <li>Include realistic commission and slippage estimates</li>
                    <li>Test across different market conditions</li>
                    <li>Validate results with out-of-sample data</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <TestTube size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-amber-800">
                  <p className="font-medium mb-1">Limitations</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Past performance doesn't guarantee future results</li>
                    <li>Market conditions can change significantly</li>
                    <li>Real-world execution may differ from backtests</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      {results ? (
        <BacktestResults results={results} />
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Backtest Results</h3>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
            <TestTube size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-600">Configure your test parameters and click "Run Backtest" to see results</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Backtest;