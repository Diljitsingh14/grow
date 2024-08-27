import { ITheme } from "@/types/forms";

export const PUBLIC_FORM_URL_PREFIX = `http://localhost:3000/public-form/`;

export const DEFAULT_FORM_THEME: ITheme = {
  id: 1,
  name: "Classic",
  brand_logo: null,
  background_color: "#FFFFFF",
  text_color: "#333333",
  is_master: true,
  user: 1,
};
