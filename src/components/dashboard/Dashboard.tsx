import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  TrendingUp, TrendingDown, DollarSign, Activity, 
  ArrowUpRight, ArrowDownRight, BarChart3, Clock
} from 'lucide-react';
import { AppDispatch, RootState } from '../../store';
import { fetchPortfolioStats, fetchRecentTrades, fetchPerformanceData } from '../../store/portfolioSlice';
import { fetchStrategies } from '../../store/strategiesSlice';
import LoadingSpinner from '../common/LoadingSpinner';
import PerformanceChart from '../common/PerformanceChart';
import AllocationChart from '../common/AllocationChart';
import MetricCard from './MetricCard';
import RecentTradesTable from './RecentTradesTable';
import PortfolioSummary from './PortfolioSummary';

const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [selectedPeriod, setSelectedPeriod] = useState<'1D' | '1W' | '1M' | 'YTD'>('1W');
  
  const { stats, recentTrades, performanceData, loading } = useSelector(
    (state: RootState) => state.portfolio
  );
  const { strategies } = useSelector((state: RootState) => state.strategies);

  useEffect(() => {
    dispatch(fetchPortfolioStats());
    dispatch(fetchRecentTrades());
    dispatch(fetchStrategies());
    dispatch(fetchPerformanceData(selectedPeriod));
  }, [dispatch, selectedPeriod]);

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="large" text="Loading dashboard..." />
      </div>
    );
  }

  const mockPerformanceData = [
    { date: '2025-01-19', value: 0, benchmark: 0 },
    { date: '2025-01-20', value: 0.8, benchmark: 0.5 },
    { date: '2025-01-21', value: 1.2, benchmark: 0.8 },
    { date: '2025-01-22', value: 2.1, benchmark: 1.2 },
    { date: '2025-01-23', value: 1.8, benchmark: 1.0 },
    { date: '2025-01-24', value: 2.5, benchmark: 1.5 },
    { date: '2025-01-25', value: 3.2, benchmark: 1.8 },
  ];

  const mockAllocationData = [
    { name: 'Equities', value: 45, color: '#3B82F6' },
    { name: 'Fixed Income', value: 30, color: '#10B981' },
    { name: 'Commodities', value: 15, color: '#F59E0B' },
    { name: 'Cash', value: 10, color: '#6B7280' },
  ];

  return (
    <div className="space-y-6">
      {/* Portfolio Summary */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-800 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-medium text-blue-100">Total Assets Under Management</h2>
            <div className="flex items-baseline space-x-3 mt-2">
              <h1 className="text-4xl font-bold">
                ${((stats?.totalAUM || 0) / 1000000).toFixed(2)}M
              </h1>
              <div className="flex items-center space-x-1">
                {(stats?.dayChange || 0) > 0 ? 
                  <ArrowUpRight size={20} className="text-green-300" /> : 
                  <ArrowDownRight size={20} className="text-red-300" />
                }
                <span className="text-lg">
                  ${Math.abs(stats?.dayChange || 0).toLocaleString()} ({stats?.dayChangePercent || 0}%)
                </span>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <TrendingUp size={48} className="text-blue-200 opacity-50" />
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div>
            <p className="text-sm text-blue-100">Active Strategies</p>
            <p className="text-xl font-semibold">{stats?.activeStrategies || 0}</p>
          </div>
          <div>
            <p className="text-sm text-blue-100">YTD Return</p>
            <p className="text-xl font-semibold">+{stats?.ytdReturn || 0}%</p>
          </div>
          <div>
            <p className="text-sm text-blue-100">Monthly Return</p>
            <p className="text-xl font-semibold">+{stats?.monthlyReturn || 0}%</p>
          </div>
          <div>
            <p className="text-sm text-blue-100">Win Rate</p>
            <p className="text-xl font-semibold">{stats?.winRate || 0}%</p>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard 
          title="Daily P&L" 
          value={stats?.dayChange || 0} 
          change={stats?.dayChangePercent}
          prefix="$" 
          icon={DollarSign}
        />
        <MetricCard 
          title="Win Rate" 
          value={stats?.winRate || 0} 
          suffix="%" 
          info="Percentage of profitable trades"
          icon={TrendingUp}
        />
        <MetricCard 
          title="Sharpe Ratio" 
          value={stats?.sharpeRatio || 0} 
          info="Risk-adjusted returns"
          icon={Activity}
        />
        <MetricCard 
          title="Active Positions" 
          value={strategies.reduce((sum, s) => sum + s.positions, 0)} 
          icon={BarChart3}
        />
      </div>

      {/* Performance Chart */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Portfolio Performance</h2>
          <div className="flex items-center space-x-2">
            {(['1D', '1W', '1M', 'YTD'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-3 py-1 text-sm rounded transition-colors ${
                  selectedPeriod === period
                    ? 'bg-blue-700 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>
        <PerformanceChart 
          data={performanceData.length > 0 ? performanceData : mockPerformanceData}
          showBenchmark={true}
          height={300}
        />
      </div>

      {/* Recent Trades and Allocation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentTradesTable trades={recentTrades} />
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Portfolio Allocation</h3>
          <AllocationChart 
            data={mockAllocationData}
            height={250}
          />
        </div>
      </div>

      {/* Portfolio Summary */}
      <PortfolioSummary strategies={strategies} />
    </div>
  );
};

export default Dashboard;