import React, { useState, useEffect } from 'react';
import { useTokens } from '../contexts/token-context';
import { tokenUpdateService } from '../services/token-update-service';
import { PlatformComponents } from '../utils/platform-adapter';

interface TokenUpdateStatusProps {
  showLastUpdated?: boolean;
  showRefreshButton?: boolean;
  className?: string;
}

/**
 * Component to display token update status and provide manual refresh functionality
 */
export const TokenUpdateStatus: React.FC<TokenUpdateStatusProps> = ({
  showLastUpdated = true,
  showRefreshButton = true,
  className = '',
}) => {
  const { lastUpdated, isLoading, refreshTokenData } = useTokens();
  const [isRunning, setIsRunning] = useState<boolean>(false);
  
  // Check if the update service is running
  useEffect(() => {
    setIsRunning(tokenUpdateService.isRunning());
    
    // Set up an interval to check the status
    const intervalId = setInterval(() => {
      setIsRunning(tokenUpdateService.isRunning());
    }, 5000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  // Format the last updated time
  const formatLastUpdated = () => {
    if (!lastUpdated) return 'Never updated';
    
    const now = new Date();
    const diff = now.getTime() - lastUpdated.getTime();
    
    // Less than a minute
    if (diff < 60000) {
      return 'Just now';
    }
    
    // Less than an hour
    if (diff < 3600000) {
      const minutes = Math.floor(diff / 60000);
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    }
    
    // Less than a day
    if (diff < 86400000) {
      const hours = Math.floor(diff / 3600000);
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    }
    
    // Format as date
    return lastUpdated.toLocaleString();
  };
  
  // Handle manual refresh
  const handleRefresh = () => {
    refreshTokenData();
  };
  
  // Toggle auto-update service
  const toggleAutoUpdate = () => {
    if (isRunning) {
      tokenUpdateService.stop();
    } else {
      tokenUpdateService.start();
    }
    setIsRunning(!isRunning);
  };
  
  return (
    <div className={`token-update-status ${className}`}>
      {showLastUpdated && (
        <div className="last-updated">
          <span className="label">Last updated:</span>
          <span className="value">{formatLastUpdated()}</span>
        </div>
      )}
      
      <div className="update-controls">
        {showRefreshButton && (
          <button 
            className="refresh-button"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            {isLoading ? 'Refreshing...' : 'Refresh Now'}
          </button>
        )}
        
        <button 
          className={`auto-update-toggle ${isRunning ? 'active' : 'inactive'}`}
          onClick={toggleAutoUpdate}
        >
          Auto-Update: {isRunning ? 'On' : 'Off'}
        </button>
      </div>
      
      {isLoading && (
        <div className="loading-indicator">
          <PlatformComponents.ActivityIndicator />
          <span>Updating token data...</span>
        </div>
      )}
    </div>
  );
};

export default TokenUpdateStatus;