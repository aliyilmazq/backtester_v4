import React from 'react';
import { Strategy } from '../../types';
import { MoreVertical, Clock, TrendingUp, TrendingDown } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { toggleStrategyStatus, selectStrategy } from '../../store/strategiesSlice';

interface StrategyCardProps {
  strategy: Strategy;
  onClick: () => void;
}

const StrategyCard: React.FC<StrategyCardProps> = ({ strategy, onClick }) => {
  const dispatch = useDispatch<AppDispatch>();

  const statusColors = {
    active: 'bg-green-100 text-green-700',
    paused: 'bg-yellow-100 text-yellow-700',
    stopped: 'bg-red-100 text-red-700'
  };

  const riskColors = {
    Conservative: 'text-green-600',
    Moderate: 'text-yellow-600',
    Aggressive: 'text-red-600'
  };

  const handleToggleStatus = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await dispatch(toggleStrategyStatus(strategy.id));
  };

  const handleClick = () => {
    dispatch(selectStrategy(strategy));
    onClick();
  };

  return (
    <div 
      className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-all cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{strategy.name}</h3>
          <div className="flex items-center space-x-3 mt-2">
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[strategy.status]}`}>
              {strategy.status.toUpperCase()}
            </span>
            <span className={`text-sm ${riskColors[strategy.risk]}`}>
              {strategy.risk} Risk
            </span>
          </div>
        </div>
        <button 
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="More options"
        >
          <MoreVertical size={16} className="text-gray-400" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-gray-500 mb-1">AUM</p>
          <p className="text-lg font-semibold text-gray-900">
            ${(strategy.aum / 1000000).toFixed(1)}M
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">YTD Return</p>
          <p className={`text-lg font-semibold flex items-center ${
            strategy.performance > 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {strategy.performance > 0 ? (
              <TrendingUp size={16} className="mr-1" />
            ) : (
              <TrendingDown size={16} className="mr-1" />
            )}
            {strategy.performance > 0 ? '+' : ''}{strategy.performance}%
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Sharpe Ratio</p>
          <p className="text-lg font-semibold text-gray-900">{strategy.sharpe}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Max Drawdown</p>
          <p className="text-lg font-semibold text-red-600">{strategy.maxDrawdown}%</p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Clock size={14} />
          <span>Rebalanced {new Date(strategy.lastRebalance).toLocaleDateString()}</span>
        </div>
        <button 
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            strategy.status === 'active' 
              ? 'bg-red-50 text-red-600 hover:bg-red-100' 
              : 'bg-green-50 text-green-600 hover:bg-green-100'
          }`}
          onClick={handleToggleStatus}
        >
          {strategy.status === 'active' ? 'Pause' : 'Resume'}
        </button>
      </div>
    </div>
  );
};

export default StrategyCard;