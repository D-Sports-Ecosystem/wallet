// D-Sports OAuth Callback Handler Example
// This is what D-Sports would need to implement at auth.d-sports.com/callback
// to support managed OAuth credentials
//
// Installation: npm install express axios @types/express

// @ts-ignore - This is an example file, install express and axios to use
import express from 'express';
// @ts-ignore - This is an example file, install express and axios to use
import axios from 'axios';

const app = express();

// OAuth callback handler for D-Sports managed credentials
app.get('/callback', async (req, res) => {
  const { code, state, error, provider } = req.query;

  if (error) {
    return res.send(`
      <!DOCTYPE html>
      <html>
        <head><title>D-Sports Auth Error</title></head>
        <body>
          <div style="text-align: center; padding: 50px; font-family: Arial;">
            <h2>❌ Authentication Failed</h2>
            <p>Error: ${error}</p>
            <script>
              window.parent.postMessage({
                type: 'OAUTH_ERROR',
                error: '${error}'
              }, '*');
            </script>
          </div>
        </body>
      </html>
    `);
  }

  if (!code) {
    return res.status(400).send('Missing authorization code');
  }

  try {
    // Determine provider from state or referrer
    const oauthProvider = getProviderFromState(state as string);
    
    // Exchange code for access token
    const userProfile = await exchangeCodeForProfile(code as string, oauthProvider);
    
    // Return success page with user data
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>D-Sports Authentication</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
            .success { color: #22c55e; }
            .logo { font-size: 48px; margin: 20px; }
          </style>
        </head>
        <body>
          <div class="logo">🏆</div>
          <h2 class="success">✅ Authentication Successful!</h2>
          <p>Redirecting back to your app...</p>
          <script>
            window.parent.postMessage({
              type: 'OAUTH_SUCCESS',
              payload: {
                user: {
                  id: '${userProfile.id}',
                  email: '${userProfile.email}',
                  name: '${userProfile.name}',
                  avatar: '${userProfile.avatar}'
                },
                provider: '${oauthProvider}',
                token: '${userProfile.accessToken}',
                expiresAt: ${Date.now() + 3600000}
              }
            }, '*');
            
            // Close popup after 2 seconds
            setTimeout(() => {
              if (window.opener) {
                window.close();
              }
            }, 2000);
          </script>
        </body>
      </html>
    `);

  } catch (error) {
    console.error('OAuth exchange failed:', error);
    res.status(500).send(`
      <!DOCTYPE html>
      <html>
        <head><title>D-Sports Auth Error</title></head>
        <body>
          <div style="text-align: center; padding: 50px; font-family: Arial;">
            <h2>❌ Authentication Failed</h2>
            <p>Failed to exchange authorization code</p>
            <script>
              window.parent.postMessage({
                type: 'OAUTH_ERROR',
                error: 'Failed to exchange authorization code'
              }, '*');
            </script>
          </div>
        </body>
      </html>
    `);
  }
});

// Helper function to determine OAuth provider from state
function getProviderFromState(state: string): string {
  // In real implementation, you'd encode provider info in the state
  // For now, default to google
  return 'google';
}

// Exchange authorization code for user profile
async function exchangeCodeForProfile(code: string, provider: string): Promise<any> {
  switch (provider) {
    case 'google':
      return await exchangeGoogleCode(code);
    case 'facebook':
      return await exchangeFacebookCode(code);
    case 'twitter':
      return await exchangeTwitterCode(code);
    case 'discord':
      return await exchangeDiscordCode(code);
    case 'github':
      return await exchangeGithubCode(code);
    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }
}

// Google OAuth token exchange
async function exchangeGoogleCode(code: string) {
  // Exchange code for access token
  const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
    client_id: process.env.DSPORTS_GOOGLE_CLIENT_ID,
    client_secret: process.env.DSPORTS_GOOGLE_CLIENT_SECRET,
    code,
    grant_type: 'authorization_code',
    redirect_uri: 'https://auth.d-sports.com/callback'
  });

  const { access_token } = tokenResponse.data;

  // Get user profile
  const profileResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: { Authorization: `Bearer ${access_token}` }
  });

  const profile = profileResponse.data;
  
  return {
    id: profile.id,
    email: profile.email,
    name: profile.name,
    avatar: profile.picture,
    accessToken: access_token
  };
}

// Facebook OAuth token exchange
async function exchangeFacebookCode(code: string) {
  // Similar implementation for Facebook
  // ... Facebook-specific token exchange logic
  throw new Error('Facebook exchange not implemented in example');
}

// Twitter OAuth token exchange  
async function exchangeTwitterCode(code: string) {
  // Similar implementation for Twitter
  // ... Twitter-specific token exchange logic
  throw new Error('Twitter exchange not implemented in example');
}

// Discord OAuth token exchange
async function exchangeDiscordCode(code: string) {
  // Similar implementation for Discord
  // ... Discord-specific token exchange logic
  throw new Error('Discord exchange not implemented in example');
}

// GitHub OAuth token exchange
async function exchangeGithubCode(code: string) {
  // Similar implementation for GitHub
  // ... GitHub-specific token exchange logic
  throw new Error('GitHub exchange not implemented in example');
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 D-Sports OAuth service running on port ${PORT}`);
  console.log(`📍 Callback URL: http://localhost:${PORT}/callback`);
});

export default app; 