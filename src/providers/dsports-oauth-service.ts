// D-Sports managed OAuth service
// This allows customers to use D-Sports OAuth credentials for quick setup
// while still supporting custom OAuth apps for production use

export interface DSportsOAuthCredentials {
  google?: string;
  facebook?: string;
  twitter?: string;
  discord?: string;
  github?: string;
  apple?: string;
}

export interface DSportsOAuthConfig {
  environment: 'development' | 'staging' | 'production';
  customDomain?: string; // For white-label solutions
}

export class DSportsOAuthService {
  private static readonly MANAGED_CREDENTIALS: DSportsOAuthCredentials = {
    // D-Sports managed OAuth credentials (demo/development)
    google: '123456789-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com',
    facebook: '1234567890123456',
    twitter: 'your-twitter-oauth-client-id', 
    discord: 'your-discord-oauth-client-id',
    github: 'your-github-oauth-client-id',
    // Note: Apple requires individual app setup due to their restrictions
  };

  private static readonly REDIRECT_URIS = {
    development: 'https://auth.d-sports.com/dev/callback',
    staging: 'https://auth.d-sports.com/staging/callback', 
    production: 'https://auth.d-sports.com/callback'
  };

  /**
   * Get D-Sports managed OAuth credentials
   * Perfect for development and quick prototyping
   */
  public static getManagedCredentials(config: DSportsOAuthConfig): {
    clientIds: DSportsOAuthCredentials;
    redirectUri: string;
  } {
    return {
      clientIds: this.MANAGED_CREDENTIALS,
      redirectUri: config.customDomain 
        ? `https://${config.customDomain}/auth/callback`
        : this.REDIRECT_URIS[config.environment]
    };
  }

  /**
   * Check if using D-Sports managed credentials
   */
  public static isManagedCredentials(clientId: string): boolean {
    return Object.values(this.MANAGED_CREDENTIALS).includes(clientId);
  }

  /**
   * Get quick start configuration for development
   */
  public static getQuickStartConfig(): any {
    const managed = this.getManagedCredentials({ environment: 'development' });
    
    return {
      appSecret: 'dsports-demo-secret-do-not-use-in-production',
      redirectUri: managed.redirectUri,
      providers: {
        google: { clientId: managed.clientIds.google },
        facebook: { clientId: managed.clientIds.facebook },
        twitter: { clientId: managed.clientIds.twitter },
        discord: { clientId: managed.clientIds.discord },
        github: { clientId: managed.clientIds.github },
      },
    };
  }

  /**
   * Validate that production apps are using custom credentials
   */
  public static validateProductionConfig(config: any): {
    isValid: boolean;
    warnings: string[];
    errors: string[];
  } {
    const warnings: string[] = [];
    const errors: string[] = [];

    // Check if using demo credentials in production
    if (config.appSecret === 'dsports-demo-secret-do-not-use-in-production') {
      errors.push('Using demo app secret in production. Please set your own appSecret.');
    }

    // Check for managed credentials
    Object.entries(config.providers || {}).forEach(([provider, providerConfig]: [string, any]) => {
      if (this.isManagedCredentials(providerConfig.clientId)) {
        warnings.push(`Using D-Sports managed ${provider} credentials. Consider setting up your own OAuth app for production.`);
      }
    });

    // Check redirect URI
    if (config.redirectUri && config.redirectUri.includes('d-sports.com')) {
      warnings.push('Using D-Sports managed redirect URI. Consider setting up your own domain for production.');
    }

    return {
      isValid: errors.length === 0,
      warnings,
      errors
    };
  }
}

// Helper function to create quick start social login config
export function createQuickStartSocialLogin(): any {
  console.log('🚀 Using D-Sports managed OAuth credentials for quick start!');
  console.log('📝 For production, set up your own OAuth apps: https://docs.d-sports.com/oauth-setup');
  
  return DSportsOAuthService.getQuickStartConfig();
}

// Helper function for production-ready config validation
export function validateSocialLoginConfig(config: any, environment: 'development' | 'production' = 'development') {
  if (environment === 'production') {
    const validation = DSportsOAuthService.validateProductionConfig(config);
    
    if (!validation.isValid) {
      console.error('❌ Production configuration errors:');
      validation.errors.forEach(error => console.error(`  - ${error}`));
      throw new Error('Invalid production configuration');
    }

    if (validation.warnings.length > 0) {
      console.warn('⚠️  Production configuration warnings:');
      validation.warnings.forEach(warning => console.warn(`  - ${warning}`));
    }
  }

  return config;
} 