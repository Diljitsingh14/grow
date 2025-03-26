// Backend API endpoints

export const HOST = process.env.BACKEND_HOST;

export const AUTH_API = {
  LOGIN: `/api/token/`,
  REFRESH_TOKEN_URL: `/api/token/refresh/`,
  SOCIAL_PROFILE: `/api/v1/social-profiles/`,
  CONNECT_OAUTH_ACCOUNT: `/api/v1/oauth-accounts/`,
  PING: `/api/v1/auth_test/`,
};

export const TURNX_API = {
  MASTER_FORM_TEMPLATES: `/api/turnx/master-form-templates/`,
  FORM_TEMPLATES: `/api/turnx/form-templates/`,
  MASTER_FORM_THEMES: `/api/turnx/master-form-themes/`,

  CONNECT_FORM: `/api/turnx/connected-forms/`,
  // UPDATE_CONNECTED_FORM: `/api/turnx/connected-forms/`,
  // DELETE_CONNECTED_FORM: `/api/turnx/connected-forms/`,
  // LIST_CONNECTED_FORM: `/api/turnx/connected-forms/`,

  PUBLISH_FORM_VIEW: `/api/turnx/connected-form/`,

  LEAD_RESPONSE: `/api/turnx/lead-responses/`,

  LEAD_CONFIRM: `/api/turnx/lead-responses/#LEAD_ID#/consume-lead/`,
  GOOGLE_CALENDAR: `/api/turnx/google-calendar`,
};

export const PRODUCT_API = {
  PRODUCT_LIST: `/api/sales/products/`,
  PRODUCT_DETAIL: `/api/sales/products/##ID##/`,
  PRODUCT_REVIEW: `/api/sales/products-reviews`,
};
