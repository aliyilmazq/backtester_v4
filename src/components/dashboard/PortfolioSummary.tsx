import React from 'react';
import { Strategy } from '../../types';
import { FileText, Download, PieChart } from 'lucide-react';

interface PortfolioSummaryProps {
  strategies: Strategy[];
}

const PortfolioSummary: React.FC<PortfolioSummaryProps> = ({ strategies }) => {
  const totalAUM = strategies.reduce((sum, s) => sum + s.aum, 0);
  const avgPerformance = strategies.reduce((sum, s) => sum + s.performance, 0) / strategies.length || 0;

  const reports = [
    { name: 'Monthly Performance Report', date: '2025-01-25', type: 'Performance' },
    { name: 'Risk Analysis Q1 2025', date: '2025-01-24', type: 'Risk' },
    { name: 'Compliance Report January', date: '2025-01-23', type: 'Compliance' },
    { name: 'Tax Summary 2024', date: '2025-01-15', type: 'Tax' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Strategy Performance</h3>
        <div className="space-y-4">
          {strategies.map((strategy) => (
            <div key={strategy.id} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">{strategy.name}</p>
                <p className="text-xs text-gray-500">
                  AUM: ${(strategy.aum / 1000000).toFixed(1)}M • {strategy.positions} positions
                </p>
              </div>
              <div className="text-right">
                <p className={`text-sm font-semibold ${
                  strategy.performance > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {strategy.performance > 0 ? '+' : ''}{strategy.performance}%
                </p>
                <p className="text-xs text-gray-500">YTD Return</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Portfolio</p>
              <p className="text-lg font-semibold text-gray-900">
                ${(totalAUM / 1000000).toFixed(1)}M
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Avg Performance</p>
              <p className={`text-lg font-semibold ${
                avgPerformance > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {avgPerformance > 0 ? '+' : ''}{avgPerformance.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Reports</h3>
        <div className="space-y-3">
          {reports.map((report, index) => (
            <div 
              key={index} 
              className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <FileText size={20} className="text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{report.name}</p>
                  <p className="text-xs text-gray-500">{report.type} • {report.date}</p>
                </div>
              </div>
              <Download size={16} className="text-gray-400 hover:text-gray-600" />
            </div>
          ))}
        </div>
        <button className="w-full mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium">
          View All Reports →
        </button>
      </div>
    </div>
  );
};

export default PortfolioSummary;