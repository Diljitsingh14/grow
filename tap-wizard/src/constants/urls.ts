// Backend API endpoints

// export const HOST = process.env.BACKEND_HOST;
export const HOST = "http://localhost:8000";

export const AUTH_API = {
  LOGIN: `${HOST}/api/token/`,
  REFRESH_TOKEN_URL: `${HOST}/api/token/refresh/`,
  SOCIAL_PROFILE: `${HOST}/api/v1/social-profiles/`,
  CONNECT_OAUTH_ACCOUNT: `${HOST}/api/v1/oauth-accounts/`,
  PING: `${HOST}/api/v1/auth_test/`,
};

export const TURNX_API = {
  MASTER_FORM_TEMPLATES: `${HOST}/api/turnx/master-form-templates/`,
  FORM_TEMPLATES: `${HOST}/api/turnx/form-templates/`,
  MASTER_FORM_THEMES: `${HOST}/api/turnx/master-form-themes/`,

  CONNECT_FORM: `${HOST}/api/turnx/connected-forms/`,
  // UPDATE_CONNECTED_FORM: `${HOST}/api/turnx/connected-forms/`,
  // DELETE_CONNECTED_FORM: `${HOST}/api/turnx/connected-forms/`,
  // LIST_CONNECTED_FORM: `${HOST}/api/turnx/connected-forms/`,

  PUBLISH_FORM_VIEW: `${HOST}/api/turnx/connected-form/`,

  LEAD_RESPONSE: `${HOST}/api/turnx/lead-responses/`,
};
