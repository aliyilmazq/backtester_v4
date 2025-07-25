import React from 'react';
import { Trade } from '../../types';
import { CheckCircle, Clock, XCircle } from 'lucide-react';

interface RecentTradesTableProps {
  trades: Trade[];
}

const RecentTradesTable: React.FC<RecentTradesTableProps> = ({ trades }) => {
  const getStatusIcon = (status: Trade['status']) => {
    switch (status) {
      case 'executed':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'pending':
        return <Clock size={16} className="text-yellow-600" />;
      case 'failed':
        return <XCircle size={16} className="text-red-600" />;
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Recent Trading Activity</h2>
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          View All Trades →
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Strategy
              </th>
              <th className="text-left py-3 px-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
              <th className="text-left py-3 px-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Asset
              </th>
              <th className="text-right py-3 px-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantity
              </th>
              <th className="text-right py-3 px-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="text-right py-3 px-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="text-center py-3 px-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="text-left py-3 px-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Time
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {trades.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-gray-500">
                  No recent trades to display
                </td>
              </tr>
            ) : (
              trades.map((trade) => (
                <tr key={trade.id} className="hover:bg-gray-50">
                  <td className="py-3 px-2 text-sm text-gray-900">{trade.strategy}</td>
                  <td className="py-3 px-2">
                    <span className={`text-sm font-medium ${
                      trade.action === 'BUY' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {trade.action}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-sm text-gray-900">{trade.asset}</td>
                  <td className="py-3 px-2 text-sm text-gray-900 text-right">{trade.quantity}</td>
                  <td className="py-3 px-2 text-sm text-gray-900 text-right">${trade.price}</td>
                  <td className="py-3 px-2 text-sm text-gray-900 text-right font-medium">
                    ${trade.total.toLocaleString()}
                  </td>
                  <td className="py-3 px-2 text-center">
                    {getStatusIcon(trade.status)}
                  </td>
                  <td className="py-3 px-2 text-sm text-gray-500">{trade.time}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentTradesTable;