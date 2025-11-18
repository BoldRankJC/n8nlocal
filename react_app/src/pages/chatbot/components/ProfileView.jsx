import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import PresenceIndicator from '../../../components/ui/PresenceIndicator';

const ProfileView = ({ 
  user, 
  showFullName = true, 
  showStatus = true, 
  showLastSeen = true,
  showRole = false,
  size = 'default',
  className = '',
  onClick = null,
  currentUser = null
}) => {
  const sizeConfig = {
    sm: {
      avatar: 'w-8 h-8',
      nameText: 'text-sm',
      statusText: 'text-xs',
      indicator: 'sm'
    },
    default: {
      avatar: 'w-10 h-10',
      nameText: 'text-sm',
      statusText: 'text-xs',
      indicator: 'sm'
    },
    lg: {
      avatar: 'w-12 h-12',
      nameText: 'text-base',
      statusText: 'text-sm',
      indicator: 'default'
    },
    xl: {
      avatar: 'w-16 h-16',
      nameText: 'text-lg',
      statusText: 'text-base',
      indicator: 'lg'
    }
  };

  const config = sizeConfig?.[size] || sizeConfig?.default;

  const getStatusText = (status) => {
    const statusMap = {
      online: 'Online',
      away: 'Away',
      busy: 'Busy',
      offline: 'Offline'
    };
    return statusMap?.[status] || 'Offline';
  };

  const getLastSeenText = (status, lastSeen) => {
    if (status === 'online') return 'Online';
    
    if (!lastSeen) return 'Last seen recently';
    
    const now = new Date();
    const lastSeenDate = new Date(lastSeen);
    const diffInMinutes = Math.floor((now - lastSeenDate) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Last seen just now';
    if (diffInMinutes < 60) return `Last seen ${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `Last seen ${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `Last seen ${diffInDays}d ago`;
    
    return lastSeenDate?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const displayName = showFullName ? user?.name : user?.name?.split(' ')?.[0];
  const isCurrentUser = currentUser && user?.id === currentUser?.id;

  return (
    <div 
      className={`flex items-center space-x-3 ${onClick ? 'cursor-pointer hover:bg-accent/50 rounded-lg p-2 transition-colors duration-200' : ''} ${className}`}
      onClick={onClick}
    >
      {/* Avatar with Status */}
      <div className="relative flex-shrink-0">
        <div className={`${config?.avatar} rounded-full overflow-hidden bg-secondary`}>
          {user?.avatar ? (
            <Image 
              src={user?.avatar} 
              alt={user?.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Icon name="User" size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} className="text-muted-foreground" />
            </div>
          )}
        </div>
        {showStatus && (
          <PresenceIndicator 
            status={user?.status || 'offline'} 
            size={config?.indicator} 
            className="absolute -bottom-0.5 -right-0.5"
          />
        )}
      </div>

      {/* User Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2">
          <h4 className={`${config?.nameText} font-medium text-foreground truncate`}>
            {displayName}
          </h4>
          {isCurrentUser && (
            <span className="text-xs text-muted-foreground">(You)</span>
          )}
          {showRole && user?.role === 'admin' && (
            <Icon name="Crown" size={12} className="text-warning" title="Admin" />
          )}
          {showRole && user?.role === 'moderator' && (
            <Icon name="Shield" size={12} className="text-info" title="Moderator" />
          )}
        </div>
        
        {showStatus && (
          <div className="flex items-center space-x-1">
            <p className={`${config?.statusText} text-muted-foreground truncate`}>
              {showLastSeen ? getLastSeenText(user?.status, user?.lastSeen) : getStatusText(user?.status)}
            </p>
            {user?.isTyping && (
              <div className="flex items-center space-x-1">
                <div className="flex space-x-1">
                  <div className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span className={`${config?.statusText} text-primary`}>typing...</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileView;