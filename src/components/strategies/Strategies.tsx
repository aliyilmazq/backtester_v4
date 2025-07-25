import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Bot } from 'lucide-react';
import { AppDispatch, RootState } from '../../store';
import { fetchStrategies } from '../../store/strategiesSlice';
import LoadingSpinner from '../common/LoadingSpinner';
import StrategyCard from './StrategyCard';
import StrategyDetailModal from './StrategyDetailModal';

const Strategies: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { strategies, loading, selectedStrategy } = useSelector(
    (state: RootState) => state.strategies
  );
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    dispatch(fetchStrategies());
  }, [dispatch]);

  if (loading && strategies.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="large" text="Loading strategies..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Trading Strategies</h2>
          <p className="text-gray-600 mt-1">Manage and monitor your algorithmic trading strategies</p>
        </div>
        <button className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-medium transition-colors flex items-center space-x-2">
          <Plus size={18} />
          <span>New Strategy</span>
        </button>
      </div>

      {/* Strategy Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {strategies.map(strategy => (
          <StrategyCard 
            key={strategy.id} 
            strategy={strategy} 
            onClick={() => {
              setShowDetailModal(true);
            }}
          />
        ))}
      </div>

      {/* Empty State */}
      {strategies.length === 0 && !loading && (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <Bot size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Strategies Yet</h3>
          <p className="text-gray-600 mb-6">Create your first algorithmic trading strategy to get started</p>
          <button className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-medium transition-colors inline-flex items-center space-x-2">
            <Plus size={18} />
            <span>Create Strategy</span>
          </button>
        </div>
      )}

      {/* Strategy Detail Modal */}
      {selectedStrategy && showDetailModal && (
        <StrategyDetailModal 
          strategy={selectedStrategy} 
          onClose={() => setShowDetailModal(false)} 
        />
      )}
    </div>
  );
};

export default Strategies;