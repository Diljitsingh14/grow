// Backend API endpoints

// export const HOST = process.env.BACKEND_HOST;
export const HOST = "http://localhost:8000";

export const AUTH_API = {
  LOGIN: `${HOST}/api/token/`,
  REFRESH_TOKEN_URL: `${HOST}/api/token/refresh/`,
  CONNECT_OAUTH_ACCOUNT: `${HOST}/api/v1/oauth-accounts/`,
  PING: `${HOST}/api/v1/auth_test/`,
};
