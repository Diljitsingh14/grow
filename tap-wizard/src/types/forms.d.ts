export interface IFormField {
  name: string;
  type: string;
  desc: string;
  helptext: string;
  is_required?: boolean;
  response?: any;
}

export interface ITemplate {
  id: number;
  fields: IFormField[];
  name: string;
  description: string;
  is_master: boolean;
  is_draft: boolean;
  user: number;
}

export interface ISocialProfile {
  id: number;
  iss: string;
  azp: string;
  aud: string;
  sub: string;
  email: string;
  email_verified: boolean;
  at_hash: string;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
  iat: number;
  exp: number;
}

export interface IAccount {
  id: number;
  social_profile: ISocialProfile;
  provider: string;
  provider_account_id: string;
  access_token: string;
  expires_at: number;
  scope: string;
  token_type: string;
  id_token: string;
  user: number;
}

export interface IFormTheme {
  id: number;
  name: string;
  brand_logo: string | null;
  background_color: string;
  text_color: string;
  is_master: boolean;
  user: number;
}

export interface IConnectedForm {
  id: number;
  account: IAccount;
  form_theme: IFormTheme;
  status: string;
  public_link_uuid: string;
  form_template: number;
}

export interface ITheme {
  id: number;
  name: string;
  brand_logo: string | null;
  background_color: string;
  text_color: string;
  is_master: boolean;
  user: number;
}

export interface ILead {
  id: number;
  form_response: IFormField[] | { [key: string]: string };
  created_at: string;
  status: string;
  lead_name: string | null;
  lead_email: string | null;
}

export interface ILeadConsumeRequestData {
  id: string | number;
  status: "Accepted" | "Declined";
  message?: string;
}
