import React from 'react';
import { AlertCircle, AlertTriangle, Info, CheckCircle } from 'lucide-react';

interface AlertProps {
  level?: 'info' | 'warning' | 'error' | 'success';
  children: React.ReactNode;
}

export const Alert: React.FC<AlertProps> = ({ level = 'info', children }) => {
  const configs = {
    info: {
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-800',
      icon: Info,
      iconColor: 'text-blue-500'
    },
    warning: {
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      textColor: 'text-yellow-800',
      icon: AlertTriangle,
      iconColor: 'text-yellow-500'
    },
    error: {
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-800',
      icon: AlertCircle,
      iconColor: 'text-red-500'
    },
    success: {
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-800',
      icon: CheckCircle,
      iconColor: 'text-green-500'
    }
  };

  const config = configs[level] || configs.info;
  const Icon = config.icon;

  return (
    <div className={`flex items-center gap-3 p-4 rounded-lg border ${config.bgColor} ${config.borderColor}`}>
      <Icon className={`w-5 h-5 flex-shrink-0 ${config.iconColor}`} />
      <div className={`flex-1 ${config.textColor} font-medium`}>
        {children}
      </div>
    </div>
  );
};
