import React from 'react';
import { RefreshCw } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  text?: string;
  fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium', 
  text,
  fullScreen = false 
}) => {
  const sizes = {
    small: 16,
    medium: 24,
    large: 32,
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center">
      <RefreshCw 
        size={sizes[size]} 
        className="animate-spin text-blue-600"
        aria-label="Loading"
      />
      {text && (
        <p className="mt-2 text-sm text-gray-600">{text}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;