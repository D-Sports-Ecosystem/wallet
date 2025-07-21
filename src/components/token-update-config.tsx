import React, { useState, useEffect } from 'react';
import { tokenUpdateService } from '../services/token-update-service';
import { tokenSyncService } from '../utils/token-sync';

interface TokenUpdateConfigProps {
  onSave?: () => void;
  className?: string;
}

/**
 * Component to configure token update settings
 */
export const TokenUpdateConfig: React.FC<TokenUpdateConfigProps> = ({
  onSave,
  className = '',
}) => {
  // Configuration state
  const [refreshInterval, setRefreshInterval] = useState<number>(300000); // 5 minutes
  const [cacheTTL, setCacheTTL] = useState<number>(300000); // 5 minutes
  const [symbols, setSymbols] = useState<string[]>(['BTC', 'ETH', 'MATIC', 'USDC', 'BNB']);
  const [currency, setCurrency] = useState<string>('USD');
  const [persistToStorage, setPersistToStorage] = useState<boolean>(true);
  const [maxCacheAge, setMaxCacheAge] = useState<number>(3600000); // 1 hour
  
  // Load current configuration on mount
  useEffect(() => {
    // Get current configuration from token update service
    const currentConfig = {
      refreshInterval: tokenUpdateService['config'].refreshInterval,
      cacheTTL: tokenUpdateService['config'].cacheTTL,
      symbols: tokenUpdateService['config'].symbols,
      currency: tokenUpdateService['config'].currency,
    };
    
    // Update state with current configuration
    setRefreshInterval(currentConfig.refreshInterval);
    setCacheTTL(currentConfig.cacheTTL);
    setSymbols(currentConfig.symbols);
    setCurrency(currentConfig.currency);
    
    // Try to get token sync service configuration
    try {
      const syncConfig = {
        persistToStorage: tokenSyncService['config'].persistToStorage,
        maxCacheAge: tokenSyncService['config'].maxCacheAge,
      };
      
      setPersistToStorage(syncConfig.persistToStorage);
      setMaxCacheAge(syncConfig.maxCacheAge);
    } catch (error) {
      console.error('Failed to load token sync configuration:', error);
    }
  }, []);
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update token update service configuration
    tokenUpdateService.updateConfig({
      refreshInterval,
      cacheTTL,
      symbols,
      currency,
    });
    
    // Update token sync service configuration
    try {
      tokenSyncService.updateConfig({
        refreshInterval,
        cacheTTL,
        symbols,
        currency,
        persistToStorage,
        maxCacheAge,
      });
    } catch (error) {
      console.error('Failed to update token sync configuration:', error);
    }
    
    // Call onSave callback if provided
    if (onSave) {
      onSave();
    }
  };
  
  // Handle symbol input change
  const handleSymbolsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const symbolsString = e.target.value;
    const symbolsArray = symbolsString.split(',').map(s => s.trim().toUpperCase());
    setSymbols(symbolsArray);
  };
  
  return (
    <div className={`token-update-config ${className}`}>
      <h3>Token Update Configuration</h3>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="refreshInterval">Refresh Interval (ms):</label>
          <input
            id="refreshInterval"
            type="number"
            min="10000"
            step="10000"
            value={refreshInterval}
            onChange={(e) => setRefreshInterval(Number(e.target.value))}
          />
          <span className="help-text">
            {(refreshInterval / 60000).toFixed(1)} minutes
          </span>
        </div>
        
        <div className="form-group">
          <label htmlFor="cacheTTL">Cache TTL (ms):</label>
          <input
            id="cacheTTL"
            type="number"
            min="10000"
            step="10000"
            value={cacheTTL}
            onChange={(e) => setCacheTTL(Number(e.target.value))}
          />
          <span className="help-text">
            {(cacheTTL / 60000).toFixed(1)} minutes
          </span>
        </div>
        
        <div className="form-group">
          <label htmlFor="symbols">Token Symbols:</label>
          <input
            id="symbols"
            type="text"
            value={symbols.join(', ')}
            onChange={handleSymbolsChange}
          />
          <span className="help-text">
            Comma-separated list of token symbols
          </span>
        </div>
        
        <div className="form-group">
          <label htmlFor="currency">Currency:</label>
          <select
            id="currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
            <option value="JPY">JPY</option>
            <option value="CAD">CAD</option>
            <option value="AUD">AUD</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="persistToStorage">Persist to Storage:</label>
          <input
            id="persistToStorage"
            type="checkbox"
            checked={persistToStorage}
            onChange={(e) => setPersistToStorage(e.target.checked)}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="maxCacheAge">Max Cache Age (ms):</label>
          <input
            id="maxCacheAge"
            type="number"
            min="60000"
            step="60000"
            value={maxCacheAge}
            onChange={(e) => setMaxCacheAge(Number(e.target.value))}
          />
          <span className="help-text">
            {(maxCacheAge / 60000).toFixed(1)} minutes
          </span>
        </div>
        
        <div className="form-actions">
          <button type="submit" className="save-button">
            Save Configuration
          </button>
          <button 
            type="button" 
            className="clear-cache-button"
            onClick={() => {
              tokenUpdateService.clearCache();
              tokenSyncService.clearCache();
              alert('Token cache cleared!');
            }}
          >
            Clear Cache
          </button>
        </div>
      </form>
    </div>
  );
};

export default TokenUpdateConfig;