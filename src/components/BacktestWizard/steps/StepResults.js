import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Percent, 
  Activity,
  BarChart3,
  Download,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  XCircle,
  Calendar,
  Hash
} from 'lucide-react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const StepResults = ({ data, results, onNewBacktest, onExport }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [chartTimeframe, setChartTimeframe] = useState('all');

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Format percentage
  const formatPercent = (value) => {
    const formatted = (value * 100).toFixed(2);
    return `${value >= 0 ? '+' : ''}${formatted}%`;
  };

  // Format date
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Metric Card Component
  const MetricCard = ({ title, value, icon: Icon, trend, format = 'currency', color = 'blue' }) => {
    const colorClasses = {
      blue: 'bg-blue-50 text-blue-600',
      green: 'bg-green-50 text-green-600',
      red: 'bg-red-50 text-red-600',
      yellow: 'bg-yellow-50 text-yellow-600',
      purple: 'bg-purple-50 text-purple-600'
    };

    return (
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">{title}</span>
          <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
        <div className="text-2xl font-bold text-gray-900">
          {format === 'currency' ? formatCurrency(value) : 
           format === 'percent' ? formatPercent(value) : 
           format === 'number' ? value.toLocaleString() : value}
        </div>
        {trend !== undefined && (
          <div className="flex items-center mt-2">
            {trend > 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
            )}
            <span className={`text-sm ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatPercent(trend)}
            </span>
          </div>
        )}
      </div>
    );
  };

  // Prepare chart data
  const prepareEquityCurveData = () => {
    if (!results?.equityCurve) return null;

    const labels = results.equityCurve.map(point => formatDate(point.date));
    const portfolioValues = results.equityCurve.map(point => point.value);
    const benchmarkValues = results.equityCurve.map(point => point.benchmark);

    return {
      labels,
      datasets: [
        {
          label: 'Portfolio Value',
          data: portfolioValues,
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: true,
          tension: 0.1
        },
        {
          label: 'Buy & Hold',
          data: benchmarkValues,
          borderColor: 'rgb(156, 163, 175)',
          backgroundColor: 'rgba(156, 163, 175, 0.1)',
          fill: true,
          tension: 0.1
        }
      ]
    };
  };

  const prepareDrawdownData = () => {
    if (!results?.drawdownSeries) return null;

    const labels = results.drawdownSeries.map(point => formatDate(point.date));
    const drawdowns = results.drawdownSeries.map(point => point.drawdown * 100);

    return {
      labels,
      datasets: [
        {
          label: 'Drawdown %',
          data: drawdowns,
          borderColor: 'rgb(239, 68, 68)',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          fill: true,
          tension: 0.1
        }
      ]
    };
  };

  const prepareMonthlyReturnsData = () => {
    if (!results?.monthlyReturns) return null;

    const labels = results.monthlyReturns.map(m => `${m.month}/${m.year}`);
    const returns = results.monthlyReturns.map(m => m.return * 100);

    return {
      labels,
      datasets: [
        {
          label: 'Monthly Return %',
          data: returns,
          backgroundColor: returns.map(r => r >= 0 ? 'rgba(34, 197, 94, 0.8)' : 'rgba(239, 68, 68, 0.8)')
        }
      ]
    };
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      }
    }
  };

  if (!results) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">No results to display</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Backtest Results
          </h3>
          <p className="text-sm text-gray-600">
            {data.symbol?.displaySymbol} • {formatDate(data.startDate)} to {formatDate(data.endDate)}
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={onExport}
            className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
          <button
            onClick={onNewBacktest}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            New Backtest
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
            activeTab === 'overview'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('performance')}
          className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
            activeTab === 'performance'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Performance
        </button>
        <button
          onClick={() => setActiveTab('trades')}
          className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
            activeTab === 'trades'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Trades
        </button>
        <button
          onClick={() => setActiveTab('risk')}
          className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
            activeTab === 'risk'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Risk Metrics
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              title="Final Portfolio Value"
              value={results.metrics.finalValue}
              icon={DollarSign}
              trend={(results.metrics.finalValue - results.metrics.initialCapital) / results.metrics.initialCapital}
              color="blue"
            />
            <MetricCard
              title="Total Return"
              value={results.metrics.totalReturn}
              icon={TrendingUp}
              format="percent"
              color={results.metrics.totalReturn >= 0 ? 'green' : 'red'}
            />
            <MetricCard
              title="Sharpe Ratio"
              value={results.metrics.sharpeRatio}
              icon={Activity}
              format="number"
              color="purple"
            />
            <MetricCard
              title="Max Drawdown"
              value={results.metrics.maxDrawdown}
              icon={TrendingDown}
              format="percent"
              color="red"
            />
          </div>

          {/* Equity Curve Chart */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Equity Curve</h4>
            <div className="h-96">
              {prepareEquityCurveData() && (
                <Line data={prepareEquityCurveData()} options={chartOptions} />
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'performance' && (
        <div className="space-y-6">
          {/* Performance Metrics */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <MetricCard
              title="Annual Return"
              value={results.metrics.annualReturn}
              icon={Percent}
              format="percent"
              color={results.metrics.annualReturn >= 0 ? 'green' : 'red'}
            />
            <MetricCard
              title="Win Rate"
              value={results.metrics.winRate}
              icon={CheckCircle}
              format="percent"
              color="green"
            />
            <MetricCard
              title="Profit Factor"
              value={results.metrics.profitFactor}
              icon={BarChart3}
              format="number"
              color="blue"
            />
            <MetricCard
              title="Average Win"
              value={results.metrics.avgWin}
              icon={TrendingUp}
              format="currency"
              color="green"
            />
            <MetricCard
              title="Average Loss"
              value={results.metrics.avgLoss}
              icon={TrendingDown}
              format="currency"
              color="red"
            />
            <MetricCard
              title="Expectancy"
              value={results.metrics.expectancy}
              icon={DollarSign}
              format="currency"
              color="purple"
            />
          </div>

          {/* Monthly Returns Chart */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Monthly Returns</h4>
            <div className="h-64">
              {prepareMonthlyReturnsData() && (
                <Bar data={prepareMonthlyReturnsData()} options={chartOptions} />
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'trades' && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {/* Trade Summary */}
          <div className="p-6 border-b border-gray-200">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
              <div>
                <p className="text-sm text-gray-600">Total Trades</p>
                <p className="text-2xl font-bold text-gray-900">{results.metrics.totalTrades}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Winning Trades</p>
                <p className="text-2xl font-bold text-green-600">{results.metrics.winningTrades}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Losing Trades</p>
                <p className="text-2xl font-bold text-red-600">{results.metrics.losingTrades}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Win/Loss Ratio</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(results.metrics.avgWin / Math.abs(results.metrics.avgLoss)).toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Trades Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Entry Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Exit Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Entry Price
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Exit Price
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    P&L
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Return
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {results.trades?.slice(0, 10).map((trade, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(trade.entryDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(trade.exitDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        trade.type === 'LONG' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {trade.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      ${trade.entryPrice.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      ${trade.exitPrice.toFixed(2)}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-right ${
                      trade.pnl >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {formatCurrency(trade.pnl)}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-right ${
                      trade.return >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {formatPercent(trade.return)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {results.trades?.length > 10 && (
            <div className="p-4 text-center text-sm text-gray-600">
              Showing 10 of {results.trades.length} trades
            </div>
          )}
        </div>
      )}

      {activeTab === 'risk' && (
        <div className="space-y-6">
          {/* Risk Metrics */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <MetricCard
              title="Max Drawdown"
              value={results.metrics.maxDrawdown}
              icon={TrendingDown}
              format="percent"
              color="red"
            />
            <MetricCard
              title="Max Drawdown Duration"
              value={`${results.metrics.maxDrawdownDays} days`}
              icon={Calendar}
              format="raw"
              color="orange"
            />
            <MetricCard
              title="Volatility (Annual)"
              value={results.metrics.annualVolatility}
              icon={Activity}
              format="percent"
              color="yellow"
            />
            <MetricCard
              title="Sharpe Ratio"
              value={results.metrics.sharpeRatio}
              icon={BarChart3}
              format="number"
              color="purple"
            />
            <MetricCard
              title="Sortino Ratio"
              value={results.metrics.sortinoRatio}
              icon={BarChart3}
              format="number"
              color="blue"
            />
            <MetricCard
              title="Calmar Ratio"
              value={results.metrics.calmarRatio}
              icon={BarChart3}
              format="number"
              color="green"
            />
          </div>

          {/* Drawdown Chart */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Drawdown History</h4>
            <div className="h-64">
              {prepareDrawdownData() && (
                <Line data={prepareDrawdownData()} options={chartOptions} />
              )}
            </div>
          </div>

          {/* Risk Statistics */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Risk Statistics</h4>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-gray-600">Value at Risk (95%)</p>
                <p className="text-xl font-semibold text-gray-900">{formatPercent(results.metrics.var95)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Conditional VaR (95%)</p>
                <p className="text-xl font-semibold text-gray-900">{formatPercent(results.metrics.cvar95)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Best Day</p>
                <p className="text-xl font-semibold text-green-600">{formatPercent(results.metrics.bestDay)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Worst Day</p>
                <p className="text-xl font-semibold text-red-600">{formatPercent(results.metrics.worstDay)}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StepResults;