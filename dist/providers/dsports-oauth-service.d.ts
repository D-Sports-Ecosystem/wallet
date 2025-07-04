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
    customDomain?: string;
}
export declare class DSportsOAuthService {
    private static readonly MANAGED_CREDENTIALS;
    private static readonly REDIRECT_URIS;
    /**
     * Get D-Sports managed OAuth credentials
     * Perfect for development and quick prototyping
     */
    static getManagedCredentials(config: DSportsOAuthConfig): {
        clientIds: DSportsOAuthCredentials;
        redirectUri: string;
    };
    /**
     * Check if using D-Sports managed credentials
     */
    static isManagedCredentials(clientId: string): boolean;
    /**
     * Get quick start configuration for development
     */
    static getQuickStartConfig(): any;
    /**
     * Validate that production apps are using custom credentials
     */
    static validateProductionConfig(config: any): {
        isValid: boolean;
        warnings: string[];
        errors: string[];
    };
}
export declare function createQuickStartSocialLogin(): any;
export declare function validateSocialLoginConfig(config: any, environment?: 'development' | 'production'): any;
//# sourceMappingURL=dsports-oauth-service.d.ts.map