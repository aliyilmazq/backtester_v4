import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  TrendingUp, TrendingDown, DollarSign, Activity, 
  ArrowUpRight, ArrowDownRight, BarChart3, Clock,
  Shield, Award, Zap, Globe, CreditCard, PieChart,
  Bell, Search, Menu, X, ChevronRight, Eye, EyeOff
} from 'lucide-react';
import { AppDispatch, RootState } from '../../store';
import { fetchPortfolioStats, fetchRecentTrades, fetchPerformanceData } from '../../store/portfolioSlice';
import { fetchStrategies } from '../../store/strategiesSlice';
import PerformanceChart from '../common/PerformanceChart';
import AllocationChart from '../common/AllocationChart';
import '../../styles/globals.css';

const ModernDashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [selectedPeriod, setSelectedPeriod] = useState<'1D' | '1W' | '1M' | 'YTD'>('1W');
  const [showBalance, setShowBalance] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
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
    { name: 'US Equities', value: 35, color: '#0066ff' },
    { name: 'International Equities', value: 20, color: '#00c853' },
    { name: 'Fixed Income', value: 25, color: '#ffd700' },
    { name: 'Commodities', value: 10, color: '#ff3b30' },
    { name: 'Cash & Equivalents', value: 10, color: '#718096' },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const quickActions = [
    { icon: TrendingUp, label: 'New Strategy', color: 'var(--accent-blue)' },
    { icon: Activity, label: 'Run Backtest', color: 'var(--accent-green)' },
    { icon: PieChart, label: 'Rebalance', color: 'var(--accent-gold)' },
    { icon: Shield, label: 'Risk Report', color: 'var(--primary-600)' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Modern Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Search */}
            <div className="flex items-center space-x-4 lg:space-x-8">
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                  <BarChart3 size={24} className="text-white" />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-xl font-bold text-gray-900">AlgoTrade Pro</h1>
                  <p className="text-xs text-gray-500">Institutional Trading Platform</p>
                </div>
              </div>

              <div className="hidden lg:flex items-center">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search strategies, assets..."
                    className="pl-10 pr-4 py-2 w-80 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <Bell size={20} className="text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-semibold text-gray-900">John Smith</p>
                  <p className="text-xs text-gray-500">Portfolio Manager</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                  JS
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Portfolio Overview Card */}
        <div className="glass-card p-6 lg:p-8 slide-in-up">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <h2 className="text-lg font-medium text-gray-600">Total Portfolio Value</h2>
                <button 
                  onClick={() => setShowBalance(!showBalance)}
                  className="p-1 rounded hover:bg-gray-100 transition-colors"
                >
                  {showBalance ? <Eye size={18} className="text-gray-500" /> : <EyeOff size={18} className="text-gray-500" />}
                </button>
              </div>
              <div className="flex items-baseline space-x-4">
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900">
                  {showBalance ? formatCurrency(stats?.totalAUM || 7470000) : '••••••••'}
                </h1>
                <div className={`flex items-center space-x-1 ${(stats?.dayChangePercent || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {(stats?.dayChangePercent || 0) >= 0 ? <ArrowUpRight size={24} /> : <ArrowDownRight size={24} />}
                  <span className="text-lg font-semibold">
                    {Math.abs(stats?.dayChangePercent || 0.57)}%
                  </span>
                  <span className="text-sm font-normal text-gray-600">
                    ({formatCurrency(Math.abs(stats?.dayChange || 42350))})
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-4 gap-3 mt-6 lg:mt-0">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  className="group flex flex-col items-center justify-center p-3 lg:p-4 rounded-xl bg-white hover:bg-gray-50 transition-all hover:shadow-md"
                  style={{ borderLeft: `3px solid ${action.color}` }}
                >
                  <action.icon size={24} style={{ color: action.color }} className="mb-1 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-medium text-gray-700 hidden sm:block">{action.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Active Strategies', value: stats?.activeStrategies || 3, icon: Zap, change: null },
              { label: 'YTD Return', value: `${stats?.ytdReturn || 12.8}%`, icon: TrendingUp, change: 'positive' },
              { label: 'Sharpe Ratio', value: stats?.sharpeRatio || 1.87, icon: Award, change: null },
              { label: 'Win Rate', value: `${stats?.winRate || 68.4}%`, icon: Activity, change: 'positive' },
            ].map((metric, index) => (
              <div key={index} className="bg-white rounded-xl p-4 border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">{metric.label}</span>
                  <metric.icon size={20} className={
                    metric.change === 'positive' ? 'text-green-500' : 
                    metric.change === 'negative' ? 'text-red-500' : 'text-gray-400'
                  } />
                </div>
                <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Performance Chart */}
          <div className="lg:col-span-2 glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Portfolio Performance</h3>
              <div className="flex items-center space-x-2">
                {(['1D', '1W', '1M', 'YTD'] as const).map((period) => (
                  <button
                    key={period}
                    onClick={() => setSelectedPeriod(period)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
                      selectedPeriod === period
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md'
                        : 'bg-white text-gray-600 hover:bg-gray-50'
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

          {/* Allocation Chart */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Asset Allocation</h3>
            <AllocationChart 
              data={mockAllocationData}
              height={250}
            />
            <div className="mt-4 text-center">
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Rebalance Portfolio →
              </button>
            </div>
          </div>
        </div>

        {/* Active Strategies */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Active Strategies</h3>
            <button className="btn btn-primary text-sm">
              <span>View All</span>
              <ChevronRight size={16} className="ml-1" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {strategies.slice(0, 3).map((strategy) => (
              <div key={strategy.id} className="bg-white rounded-xl p-5 border border-gray-100 hover:shadow-lg transition-all cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-gray-900">{strategy.name}</h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        strategy.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {strategy.status}
                      </span>
                      <span className="text-xs text-gray-500">{strategy.risk} Risk</span>
                    </div>
                  </div>
                  <Shield size={20} className={
                    strategy.risk === 'Conservative' ? 'text-green-500' :
                    strategy.risk === 'Moderate' ? 'text-yellow-500' : 'text-red-500'
                  } />
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">AUM</span>
                    <span className="text-sm font-semibold text-gray-900">
                      ${(strategy.aum / 1000000).toFixed(1)}M
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Return</span>
                    <span className={`text-sm font-semibold ${
                      strategy.performance > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {strategy.performance > 0 ? '+' : ''}{strategy.performance}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Sharpe</span>
                    <span className="text-sm font-semibold text-gray-900">{strategy.sharpe}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View All →
            </button>
          </div>
          
          <div className="space-y-3">
            {recentTrades.slice(0, 5).map((trade, index) => (
              <div key={trade.id} className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-all">
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    trade.action === 'BUY' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {trade.action === 'BUY' ? 
                      <ArrowUpRight size={20} className="text-green-600" /> : 
                      <ArrowDownRight size={20} className="text-red-600" />
                    }
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {trade.action} {trade.quantity} {trade.asset}
                    </p>
                    <p className="text-sm text-gray-500">
                      {trade.strategy} • {trade.time}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{formatCurrency(trade.total)}</p>
                  <p className="text-sm text-gray-500">${trade.price}/share</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Mobile Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 lg:hidden z-40">
        <div className="grid grid-cols-5 h-16">
          {[
            { icon: Globe, label: 'Dashboard', active: true },
            { icon: TrendingUp, label: 'Strategies', active: false },
            { icon: Activity, label: 'Backtest', active: false },
            { icon: PieChart, label: 'Analytics', active: false },
            { icon: Shield, label: 'Risk', active: false },
          ].map((item, index) => (
            <button
              key={index}
              className={`flex flex-col items-center justify-center space-y-1 ${
                item.active ? 'text-blue-600' : 'text-gray-400'
              }`}
            >
              <item.icon size={20} />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default ModernDashboard;