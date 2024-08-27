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
