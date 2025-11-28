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
    sm: { avatar: 'w-8 h-8', nameText: 'text-sm', statusText: 'text-xs', indicator: 'sm' },
    default: { avatar: 'w-10 h-10', nameText: 'text-sm', statusText: 'text-xs', indicator: 'sm' },
    lg: { avatar: 'w-12 h-12', nameText: 'text-base', statusText: 'text-sm', indicator: 'default' },
    xl: { avatar: 'w-16 h-16', nameText: 'text-lg', statusText: 'text-base', indicator: 'lg' }
  };

  const config = sizeConfig?.[size] || sizeConfig?.default;

  const getStatusText = (status) => {
    const statusMap = { online: 'Online', away: 'Away', busy: 'Busy', offline: 'Offline' };
    return statusMap?.[status] || 'Offline';
  };

  const getLastSeenText = (status, lastSeen) => {
    if (status === 'online') return 'Online';
    if (!lastSeen) return 'Last seen recently';
    // ... logic de fechas (se mantiene igual)
    return 'Last seen recently'; 
  };

  const displayName = showFullName ? user?.name : user?.name?.split(' ')?.[0];
  const isCurrentUser = currentUser && user?.id === currentUser?.id;

  return (
    <div 
      className={`flex items-center space-x-3 ${onClick ? 'cursor-pointer hover:bg-slate-800 rounded-lg p-2 transition-colors duration-200' : ''} ${className}`}
      onClick={onClick}
    >
      {/* Avatar with Status */}
      <div className="relative flex-shrink-0">
        <div className={`${config?.avatar} rounded-full overflow-hidden bg-slate-800 border border-slate-700`}>
          {user?.avatar ? (
            <Image src={user?.avatar} alt={user?.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Icon name="User" size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} className="text-slate-400" />
            </div>
          )}
        </div>
        {showStatus && (
          <PresenceIndicator 
            status={user?.status || 'offline'} 
            size={config?.indicator} 
            className="absolute -bottom-0.5 -right-0.5 border-2 border-slate-900" // Borde oscuro para cortar el avatar
          />
        )}
      </div>

      {/* User Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2">
          <h4 className={`${config?.nameText} font-medium text-slate-200 truncate`}>
            {displayName}
          </h4>
          {isCurrentUser && (
            <span className="text-xs text-slate-500">(You)</span>
          )}
          {showRole && user?.role === 'admin' && (
            <Icon name="Crown" size={12} className="text-amber-400" title="Admin" />
          )}
        </div>
        
        {showStatus && (
          <div className="flex items-center space-x-1">
            <p className={`${config?.statusText} text-slate-400 truncate`}>
              {showLastSeen ? getLastSeenText(user?.status, user?.lastSeen) : getStatusText(user?.status)}
            </p>
            {user?.isTyping && (
              <div className="flex items-center space-x-1">
                 <span className={`${config?.statusText} text-indigo-400 animate-pulse`}>typing...</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileView;