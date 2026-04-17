import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: React.ComponentType<{ className?: string }>;
  color: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
}

const colorClasses = {
  blue: {
    bg: 'bg-blue-500',
    light: 'bg-blue-50',
    text: 'text-blue-600'
  },
  green: {
    bg: 'bg-green-500',
    light: 'bg-green-50',
    text: 'text-green-600'
  },
  yellow: {
    bg: 'bg-yellow-500',
    light: 'bg-yellow-50',
    text: 'text-yellow-600'
  },
  red: {
    bg: 'bg-red-500',
    light: 'bg-red-50',
    text: 'text-red-600'
  },
  purple: {
    bg: 'bg-purple-500',
    light: 'bg-purple-50',
    text: 'text-purple-600'
  }
};

const KPICard: React.FC<KPICardProps> = ({ 
  title, 
  value, 
  change, 
  changeType = 'neutral', 
  icon: Icon, 
  color 
}) => {
  const colors = colorClasses[color];
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 md:p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-base font-medium text-gray-700 mb-2">{title}</p>
          <p className="text-2xl md:text-3xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className={`text-sm font-medium mt-2 ${
              changeType === 'positive' ? 'text-green-600' : 
              changeType === 'negative' ? 'text-red-600' : 
              'text-gray-600'
            }`}>
              {change}
            </p>
          )}
        </div>
        <div className={`${colors.light} p-4 rounded-lg shadow-sm`}>
          <Icon className={`h-7 w-7 ${colors.text}`} />
        </div>
      </div>
    </div>
  );
};

export default KPICard;