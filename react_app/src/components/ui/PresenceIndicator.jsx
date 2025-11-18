import React from 'react';

const PresenceIndicator = ({ 
  status = 'offline', 
  size = 'default', 
  className = '',
  showLabel = false 
}) => {
  const sizeClasses = {
    sm: 'w-2 h-2',
    default: 'w-3 h-3',
    lg: 'w-4 h-4'
  };

  const statusConfig = {
    online: {
      color: 'bg-primary',
      label: 'Online',
      animate: 'animate-pulse-glow'
    },
    away: {
      color: 'bg-warning',
      label: 'Away',
      animate: ''
    },
    busy: {
      color: 'bg-error',
      label: 'Busy',
      animate: ''
    },
    offline: {
      color: 'bg-muted-foreground',
      label: 'Offline',
      animate: ''
    }
  };

  const config = statusConfig?.[status] || statusConfig?.offline;

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div 
        className={`
          ${sizeClasses?.[size]}
          ${config?.color}
          ${config?.animate}
          rounded-full
          border-2 border-background
          transition-colors duration-200
        `}
        title={config?.label}
      />
      {showLabel && (
        <span className="text-xs text-muted-foreground">
          {config?.label}
        </span>
      )}
    </div>
  );
};

export default PresenceIndicator;