import React from 'react';
import { X } from 'lucide-react';
import { Strategy } from '../../types';

interface StrategyDetailModalProps {
  strategy: Strategy;
  onClose: () => void;
}

const StrategyDetailModal: React.FC<StrategyDetailModalProps> = ({ strategy, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-lg shadow-xl overflow-hidden">
        <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">{strategy.name}</h3>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              aria-label="Close modal"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto p-6">
          {/* Strategy Overview */}
          <div className="mb-6">
            <h4 className="text-lg font-medium text-gray-900 mb-3">Performance Overview</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">AUM</p>
                <p className="text-xl font-semibold text-gray-900">
                  ${(strategy.aum / 1000000).toFixed(1)}M
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">YTD Return</p>
                <p className={`text-xl font-semibold ${
                  strategy.performance > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {strategy.performance > 0 ? '+' : ''}{strategy.performance}%
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Sharpe Ratio</p>
                <p className="text-xl font-semibold text-gray-900">{strategy.sharpe}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Max Drawdown</p>
                <p className="text-xl font-semibold text-red-600">{strategy.maxDrawdown}%</p>
              </div>
            </div>
          </div>

          {/* Risk Parameters */}
          <div className="mb-6">
            <h4 className="text-lg font-medium text-gray-900 mb-3">Risk Parameters</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Risk Level</span>
                <span className="text-sm font-medium text-gray-900">{strategy.risk}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Maximum Position Size</span>
                <span className="text-sm font-medium text-gray-900">$500,000</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Stop Loss</span>
                <span className="text-sm font-medium text-gray-900">2%</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Active Positions</span>
                <span className="text-sm font-medium text-gray-900">{strategy.positions}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button className="flex-1 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-medium transition-colors">
              Edit Strategy
            </button>
            <button className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors">
              Download Report
            </button>
            <button className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg font-medium transition-colors">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StrategyDetailModal;