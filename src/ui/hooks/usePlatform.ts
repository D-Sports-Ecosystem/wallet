import { useState, useEffect, useCallback } from 'react';
import { PlatformFeatures, PlatformActions, PlatformHookConfig, ShareData } from './types';

/**
 * Injectable platform hook that abstracts browser APIs and platform-specific features.
 * Host applications can override this to provide platform-specific implementations
 * (e.g., different behavior for web, mobile, desktop, PWA, etc.)
 */
export function usePlatform(config: PlatformHookConfig = {}): {
  features: PlatformFeatures;
  actions: PlatformActions;
  isReady: boolean;
} {
  const [isReady, setIsReady] = useState(false);
  const [features, setFeatures] = useState<PlatformFeatures>(() => ({
    localStorage: false,
    sessionStorage: false,
    clipboard: false,
    notifications: false,
    camera: false,
    geolocation: false,
    deviceMotion: false,
  }));

  // Detect platform features on mount
  useEffect(() => {
    const detectFeatures = async () => {
      const detectedFeatures: PlatformFeatures = {
        localStorage: typeof window !== 'undefined' && 'localStorage' in window,
        sessionStorage: typeof window !== 'undefined' && 'sessionStorage' in window,
        clipboard: typeof navigator !== 'undefined' && 'clipboard' in navigator,
        notifications: typeof window !== 'undefined' && 'Notification' in window,
        camera: typeof navigator !== 'undefined' && 'mediaDevices' in navigator,
        geolocation: typeof navigator !== 'undefined' && 'geolocation' in navigator,
        deviceMotion: typeof window !== 'undefined' && 'DeviceMotionEvent' in window,
      };

      setFeatures(detectedFeatures);
      setIsReady(true);
    };

    detectFeatures();
  }, []);

  // Default implementations with fallbacks
  const defaultActions: PlatformActions = {
    copyToClipboard: async (text: string): Promise<boolean> => {
      if (!features.clipboard && !config.fallbackToMock) {
        config.onFeatureUnavailable?.('clipboard');
        throw new Error('Clipboard API not available');
      }

      try {
        if (features.clipboard && navigator.clipboard) {
          await navigator.clipboard.writeText(text);
          return true;
        }

        // Fallback for older browsers
        if (typeof document !== 'undefined') {
          const textArea = document.createElement('textarea');
          textArea.value = text;
          textArea.style.position = 'fixed';
          textArea.style.left = '-999999px';
          textArea.style.top = '-999999px';
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          
          const result = document.execCommand('copy');
          document.body.removeChild(textArea);
          return result;
        }

        // Mock implementation for non-browser environments
        if (config.fallbackToMock) {
          console.log('Mock: Would copy to clipboard:', text);
          return true;
        }

        return false;
      } catch (error) {
        console.error('Failed to copy to clipboard:', error);
        if (config.fallbackToMock) {
          console.log('Mock: Would copy to clipboard:', text);
          return true;
        }
        return false;
      }
    },

    showNotification: async (title: string, options?: NotificationOptions): Promise<boolean> => {
      if (!features.notifications && !config.fallbackToMock) {
        config.onFeatureUnavailable?.('notifications');
        throw new Error('Notifications not available');
      }

      try {
        if (features.notifications && 'Notification' in window) {
          // Request permission if not granted
          if (Notification.permission === 'default') {
            const permission = await Notification.requestPermission();
            if (permission !== 'granted') {
              return false;
            }
          }

          if (Notification.permission === 'granted') {
            new Notification(title, options);
            return true;
          }
        }

        // Mock implementation
        if (config.fallbackToMock) {
          console.log('Mock: Would show notification:', title, options);
          return true;
        }

        return false;
      } catch (error) {
        console.error('Failed to show notification:', error);
        if (config.fallbackToMock) {
          console.log('Mock: Would show notification:', title, options);
          return true;
        }
        return false;
      }
    },

    vibrate: (pattern?: number | number[]): boolean => {
      try {
        if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
          return navigator.vibrate(pattern || 200);
        }

        // Mock implementation
        if (config.fallbackToMock) {
          console.log('Mock: Would vibrate with pattern:', pattern);
          return true;
        }

        config.onFeatureUnavailable?.('vibrate');
        return false;
      } catch (error) {
        console.error('Failed to vibrate:', error);
        if (config.fallbackToMock) {
          console.log('Mock: Would vibrate with pattern:', pattern);
          return true;
        }
        return false;
      }
    },

    openUrl: (url: string) => {
      try {
        if (typeof window !== 'undefined') {
          window.open(url, '_blank', 'noopener,noreferrer');
          return;
        }

        // Mock implementation
        if (config.fallbackToMock) {
          console.log('Mock: Would open URL:', url);
          return;
        }

        config.onFeatureUnavailable?.('openUrl');
      } catch (error) {
        console.error('Failed to open URL:', error);
        if (config.fallbackToMock) {
          console.log('Mock: Would open URL:', url);
        }
      }
    },

    share: async (data: ShareData): Promise<boolean> => {
      try {
        if (typeof navigator !== 'undefined' && 'share' in navigator) {
          await navigator.share(data);
          return true;
        }

        // Fallback: try to copy URL to clipboard
        if (data.url && features.clipboard) {
          await defaultActions.copyToClipboard(data.url);
          return true;
        }

        // Mock implementation
        if (config.fallbackToMock) {
          console.log('Mock: Would share:', data);
          return true;
        }

        config.onFeatureUnavailable?.('share');
        return false;
      } catch (error) {
        console.error('Failed to share:', error);
        if (config.fallbackToMock) {
          console.log('Mock: Would share:', data);
          return true;
        }
        return false;
      }
    },

    requestPermission: async (permission: string): Promise<PermissionState> => {
      try {
        if (typeof navigator !== 'undefined' && 'permissions' in navigator) {
          const result = await navigator.permissions.query({ name: permission as PermissionName });
          return result.state;
        }

        // Handle specific permissions with their own APIs
        if (permission === 'notifications' && 'Notification' in window) {
          const permission_result = await Notification.requestPermission();
          return permission_result as PermissionState;
        }

        // Mock implementation
        if (config.fallbackToMock) {
          console.log('Mock: Would request permission:', permission);
          return 'granted';
        }

        config.onFeatureUnavailable?.('permissions');
        return 'denied';
      } catch (error) {
        console.error('Failed to request permission:', error);
        if (config.fallbackToMock) {
          console.log('Mock: Would request permission:', permission);
          return 'granted';
        }
        return 'denied';
      }
    },
  };

  return {
    features,
    actions: defaultActions,
    isReady,
  };
}

/**
 * Factory function to create a custom usePlatform hook with host-specific implementations
 */
export function createPlatformHook(customActions: Partial<PlatformActions>) {
  return function useCustomPlatform(config: PlatformHookConfig = {}) {
    const defaultHook = usePlatform(config);
    
    // Override default actions with custom implementations
    const mergedActions: PlatformActions = {
      ...defaultHook.actions,
      ...customActions,
    };

    return {
      ...defaultHook,
      actions: mergedActions,
    };
  };
}

/**
 * Utility hook for PWA-specific features
 */
export function usePWAFeatures() {
  const { features, actions } = usePlatform();
  const [isInstallable, setIsInstallable] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Check if running as PWA
    const checkStandalone = () => {
      if (typeof window !== 'undefined') {
        const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches ||
                               (window.navigator as any).standalone ||
                               document.referrer.includes('android-app://');
        setIsStandalone(isStandaloneMode);
      }
    };

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    checkStandalone();

    if (typeof window !== 'undefined') {
      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      
      return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      };
    }
  }, []);

  const installPWA = useCallback(async (): Promise<boolean> => {
    if (!deferredPrompt) {
      console.warn('PWA install prompt not available');
      return false;
    }

    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setIsInstallable(false);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Failed to install PWA:', error);
      return false;
    }
  }, [deferredPrompt]);

  return {
    isInstallable,
    isStandalone,
    installPWA,
    features,
    actions,
  };
}

/**
 * Hook for device-specific capabilities
 */
export function useDeviceCapabilities() {
  const { features, actions } = usePlatform();
  const [deviceInfo, setDeviceInfo] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    touchSupport: false,
    orientation: 'unknown' as 'portrait' | 'landscape' | 'unknown',
    connectionType: 'unknown' as string,
  });

  useEffect(() => {
    const detectDevice = () => {
      if (typeof window === 'undefined') return;

      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const isTablet = /iPad/i.test(navigator.userAgent) || (isMobile && window.innerWidth > 768);
      const touchSupport = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      let orientation: 'portrait' | 'landscape' | 'unknown' = 'unknown';
      if (screen.orientation) {
        orientation = screen.orientation.angle === 0 || screen.orientation.angle === 180 ? 'portrait' : 'landscape';
      } else if (window.innerHeight > window.innerWidth) {
        orientation = 'portrait';
      } else {
        orientation = 'landscape';
      }

      let connectionType = 'unknown';
      if ('connection' in navigator) {
        connectionType = (navigator as any).connection.effectiveType || 'unknown';
      }

      setDeviceInfo({
        isMobile,
        isTablet,
        isDesktop: !isMobile && !isTablet,
        touchSupport,
        orientation,
        connectionType,
      });
    };

    detectDevice();

    // Listen for orientation changes
    const handleOrientationChange = () => {
      setTimeout(detectDevice, 100); // Small delay to let dimensions update
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('orientationchange', handleOrientationChange);
      window.addEventListener('resize', handleOrientationChange);
      
      return () => {
        window.removeEventListener('orientationchange', handleOrientationChange);
        window.removeEventListener('resize', handleOrientationChange);
      };
    }
  }, []);

  return {
    ...deviceInfo,
    features,
    actions,
  };
}
