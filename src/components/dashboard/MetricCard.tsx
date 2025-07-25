import React from 'react';
import { ArrowUpRight, ArrowDownRight, Info, LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: number | string;
  change?: number;
  prefix?: string;
  suffix?: string;
  info?: string;
  icon?: LucideIcon;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  change, 
  prefix = '', 
  suffix = '', 
  info,
  icon: Icon
}) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        <div className="flex items-center space-x-2">
          {info && (
            <div className="group relative">
              <Info size={16} className="text-gray-400 cursor-help" />
              <div className="absolute right-0 top-6 w-48 p-2 bg-gray-900 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                {info}
              </div>
            </div>
          )}
          {Icon && <Icon size={20} className="text-gray-400" />}
        </div>
      </div>
      <div className="flex items-baseline space-x-2">
        <p className="text-2xl font-semibold text-gray-900">
          {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
        </p>
        {change !== undefined && (
          <span className={`text-sm font-medium flex items-center ${
            change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-gray-500'
          }`}>
            {change > 0 ? <ArrowUpRight size={14} /> : change < 0 ? <ArrowDownRight size={14} /> : null}
            {Math.abs(change)}%
          </span>
        )}
      </div>
    </div>
  );
};

export default MetricCard;