import React from 'react';
import { BarChart3 } from 'lucide-react';

const Analytics: React.FC = () => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
      <BarChart3 size={48} className="mx-auto text-gray-300 mb-4" />
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Advanced Analytics</h3>
      <p className="text-gray-600">Comprehensive performance metrics and market analysis</p>
    </div>
  );
};

export default Analytics;