/**
 * @file dsports-oauth-service.ts
 * @description D-Sports managed OAuth service for quick setup and development.
 * Allows customers to use D-Sports OAuth credentials for quick setup
 * while still supporting custom OAuth apps for production use.
 * @module providers/dsports-oauth-service
 * @author D-Sports Engineering Team
 * @version 1.0.0
 * @since 2025-07-23
 */

/**
 * Interface for D-Sports managed OAuth credentials.
 * Contains client IDs for various OAuth providers.
 * 
 * @interface
 * @property {string} [google] - Google OAuth client ID
 * @property {string} [facebook] - Facebook OAuth client ID
 * @property {string} [twitter] - Twitter OAuth client ID
 * @property {string} [discord] - Discord OAuth client ID
 * @property {string} [github] - GitHub OAuth client ID
 * @property {string} [apple] - Apple OAuth client ID
 */
export interface DSportsOAuthCredentials {
  google?: string;
  facebook?: string;
  twitter?: string;
  discord?: string;
  github?: string;
  apple?: string;
}

/**
 * Configuration interface for D-Sports OAuth service.
 * 
 * @interface
 * @property {('development' | 'staging' | 'production')} environment - The environment to use
 * @property {string} [customDomain] - Optional custom domain for white-label solutions
 */
export interface DSportsOAuthConfig {
  environment: 'development' | 'staging' | 'production';
  customDomain?: string; // For white-label solutions
}

/**
 * Service for managing D-Sports OAuth credentials and configurations.
 * Provides managed OAuth credentials for quick development and testing.
 * 
 * @class
 * 
 * @example
 * ```typescript
 * // Get managed credentials for development
 * const credentials = DSportsOAuthService.getManagedCredentials({
 *   environment: 'development'
 * });
 * 
 * console.log(`Google client ID: ${credentials.clientIds.google}`);
 * console.log(`Redirect URI: ${credentials.redirectUri}`);
 * ```
 */
export class DSportsOAuthService {
  /**
   * D-Sports managed OAuth credentials for development and testing.
   * These are placeholder values and should be replaced in production.
   * 
   * @private
   * @static
   * @readonly
   * @type {DSportsOAuthCredentials}
   */
  private static readonly MANAGED_CREDENTIALS: DSportsOAuthCredentials = {
    // D-Sports managed OAuth credentials (demo/development)
    google: '123456789-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com',
    facebook: '1234567890123456',
    twitter: 'your-twitter-oauth-client-id', 
    discord: 'your-discord-oauth-client-id',
    github: 'your-github-oauth-client-id',
    // Note: Apple requires individual app setup due to their restrictions
  };

  /**
   * Redirect URIs for different environments.
   * 
   * @private
   * @static
   * @readonly
   * @type {Object}
   */
  private static readonly REDIRECT_URIS = {
    development: 'https://auth.d-sports.com/dev/callback',
    staging: 'https://auth.d-sports.com/staging/callback', 
    production: 'https://auth.d-sports.com/callback'
  };

  /**
   * Gets D-Sports managed OAuth credentials for the specified environment.
   * Perfect for development and quick prototyping.
   * 
   * @public
   * @static
   * @param {DSportsOAuthConfig} config - Configuration options
   * @returns {{clientIds: DSportsOAuthCredentials, redirectUri: string}} The managed credentials and redirect URI
   * 
   * @example
   * ```typescript
   * // Get managed credentials for development
   * const credentials = DSportsOAuthService.getManagedCredentials({
   *   environment: 'development'
   * });
   * 
   * // Get managed credentials with custom domain
   * const customCredentials = DSportsOAuthService.getManagedCredentials({
   *   environment: 'production',
   *   customDomain: 'auth.myapp.com'
   * });
   * ```
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
   * Checks if a client ID is one of the D-Sports managed credentials.
   * 
   * @public
   * @static
   * @param {string} clientId - The client ID to check
   * @returns {boolean} True if the client ID is a managed credential, false otherwise
   * 
   * @example
   * ```typescript
   * // Check if using managed credentials
   * const isManaged = DSportsOAuthService.isManagedCredentials(clientId);
   * if (isManaged) {
   *   console.warn('Using D-Sports managed credentials. Consider setting up your own for production.');
   * }
   * ```
   */
  public static isManagedCredentials(clientId: string): boolean {
    return Object.values(this.MANAGED_CREDENTIALS).includes(clientId);
  }

  /**
   * Gets a quick start configuration for development.
   * Includes all managed credentials and a demo app secret.
   * 
   * @public
   * @static
   * @returns {any} The quick start configuration
   * 
   * @example
   * ```typescript
   * // Get quick start configuration
   * const config = DSportsOAuthService.getQuickStartConfig();
   * 
   * // Create social login provider with quick start config
   * const socialLogin = new CustomSocialLoginProvider(config, adapter);
   * ```
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
   * Validates that production apps are using custom credentials.
   * Checks for demo app secrets, managed credentials, and managed redirect URIs.
   * 
   * @public
   * @static
   * @param {any} config - The configuration to validate
   * @returns {{isValid: boolean, warnings: string[], errors: string[]}} Validation results
   * 
   * @example
   * ```typescript
   * // Validate production configuration
   * const validation = DSportsOAuthService.validateProductionConfig(config);
   * 
   * if (!validation.isValid) {
   *   console.error('Production configuration errors:');
   *   validation.errors.forEach(error => console.error(`- ${error}`));
   * }
   * 
   * if (validation.warnings.length > 0) {
   *   console.warn('Production configuration warnings:');
   *   validation.warnings.forEach(warning => console.warn(`- ${warning}`));
   * }
   * ```
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

/**
 * Helper function to create a quick start social login configuration.
 * Uses D-Sports managed OAuth credentials for development and testing.
 * 
 * @function
 * @returns {any} The quick start social login configuration
 * 
 * @example
 * ```typescript
 * // Create quick start social login configuration
 * const config = createQuickStartSocialLogin();
 * 
 * // Create social login provider with quick start config
 * const socialLogin = new CustomSocialLoginProvider(config, adapter);
 * ```
 */
export function createQuickStartSocialLogin(): any {
  console.log('🚀 Using D-Sports managed OAuth credentials for quick start!');
  console.log('📝 For production, set up your own OAuth apps: https://docs.d-sports.com/oauth-setup');
  
  return DSportsOAuthService.getQuickStartConfig();
}

/**
 * Helper function for validating social login configuration.
 * Validates production configurations to ensure they're not using development credentials.
 * 
 * @function
 * @param {any} config - The configuration to validate
 * @param {'development' | 'production'} [environment='development'] - The environment to validate for
 * @returns {any} The validated configuration
 * @throws {Error} If the production configuration is invalid
 * 
 * @example
 * ```typescript
 * // Validate development configuration
 * const devConfig = validateSocialLoginConfig(config);
 * 
 * // Validate production configuration
 * try {
 *   const prodConfig = validateSocialLoginConfig(config, 'production');
 *   console.log('Production configuration is valid');
 * } catch (error) {
 *   console.error('Invalid production configuration:', error);
 * }
 * ```
 */
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