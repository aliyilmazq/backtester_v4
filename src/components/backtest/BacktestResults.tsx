import React from 'react';
import { BacktestResult } from '../../types';
import { TrendingUp, TrendingDown, Activity, Award } from 'lucide-react';

interface BacktestResultsProps {
  results: BacktestResult;
}

const BacktestResults: React.FC<BacktestResultsProps> = ({ results }) => {
  const metrics = [
    {
      label: 'Total Return',
      value: results.totalReturn,
      suffix: '%',
      icon: TrendingUp,
      color: results.totalReturn > 0 ? 'text-green-600' : 'text-red-600',
    },
    {
      label: 'Sharpe Ratio',
      value: results.sharpeRatio,
      icon: Activity,
      color: 'text-blue-600',
    },
    {
      label: 'Max Drawdown',
      value: results.maxDrawdown,
      suffix: '%',
      icon: TrendingDown,
      color: 'text-red-600',
    },
    {
      label: 'Win Rate',
      value: results.winRate,
      suffix: '%',
      icon: Award,
      color: results.winRate > 50 ? 'text-green-600' : 'text-yellow-600',
    },
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Backtest Results</h3>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {metrics.map((metric, index) => (
          <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
            <div className={`inline-flex p-2 rounded-full ${metric.color} bg-opacity-10 mb-2`}>
              <metric.icon size={24} className={metric.color} />
            </div>
            <p className="text-sm text-gray-600 mb-1">{metric.label}</p>
            <p className={`text-2xl font-semibold ${metric.color}`}>
              {metric.value.toFixed(2)}{metric.suffix || ''}
            </p>
          </div>
        ))}
      </div>

      {/* Detailed Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-3">Trade Statistics</h4>
          <div className="space-y-2">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Total Trades</span>
              <span className="text-sm font-medium text-gray-900">{results.trades}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Profitable Trades</span>
              <span className="text-sm font-medium text-gray-900">{results.profitableTrades}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Average Return per Trade</span>
              <span className="text-sm font-medium text-gray-900">
                {results.averageReturn.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-md font-medium text-gray-900 mb-3">Risk Metrics</h4>
          <div className="space-y-2">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Volatility (Annual)</span>
              <span className="text-sm font-medium text-gray-900">
                {results.volatility.toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Risk-Adjusted Return</span>
              <span className="text-sm font-medium text-gray-900">
                {(results.totalReturn / results.volatility).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Profit Factor</span>
              <span className="text-sm font-medium text-gray-900">
                {((results.winRate / 100) * 2).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 flex space-x-3">
        <button className="flex-1 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-medium transition-colors">
          Save Results
        </button>
        <button className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors">
          Export Report
        </button>
      </div>
    </div>
  );
};

export default BacktestResults;