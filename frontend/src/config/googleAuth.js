// Google OAuth Configuration
// IMPORTANT: Client Secret should NEVER be in frontend code!
// It's kept only on the backend for security.

export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID
export const GOOGLE_PROJECT_ID = import.meta.env.VITE_GOOGLE_PROJECT_ID
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export const GOOGLE_AUTH_CONFIG = {
  client_id: GOOGLE_CLIENT_ID,
  project_id: GOOGLE_PROJECT_ID,
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  redirect_uri: `${window.location.origin}/auth/google/callback`,
  scope: 'openid email profile',
  response_type: 'code',
  access_type: 'offline',
  prompt: 'select_account'
}

// Generate Google OAuth URL
export const getGoogleAuthUrl = () => {
  const params = new URLSearchParams({
    client_id: GOOGLE_AUTH_CONFIG.client_id,
    redirect_uri: GOOGLE_AUTH_CONFIG.redirect_uri,
    scope: GOOGLE_AUTH_CONFIG.scope,
    response_type: GOOGLE_AUTH_CONFIG.response_type,
    access_type: GOOGLE_AUTH_CONFIG.access_type,
    prompt: GOOGLE_AUTH_CONFIG.prompt
  })
  
  return `${GOOGLE_AUTH_CONFIG.auth_uri}?${params.toString()}`
}
