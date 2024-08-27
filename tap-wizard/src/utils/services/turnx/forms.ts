import { TURNX_API } from "@/constants/urls";
import axiosInstance from "@/utils/http/axiosInstance";

export const fetchMasterFromTemplates = async () => {
  return axiosInstance.get(TURNX_API.MASTER_FORM_TEMPLATES);
};

export const fetchFormTemplates = async () => {
  return axiosInstance.get(TURNX_API.FORM_TEMPLATES);
};

export const fetchMasterFormThemes = async () => {
  return axiosInstance.get(TURNX_API.MASTER_FORM_THEMES);
};

export const connectFormWithOauthAccount = async (data: any) => {
  return axiosInstance.post(TURNX_API.CONNECT_FORM, { ...data });
};

export const getPublishedFormView = async (uuid: string) => {
  return axiosInstance.get(`${TURNX_API.PUBLISH_FORM_VIEW}${uuid}/`);
};

export const submitFormResponses = async (data: any) => {
  return axiosInstance.post(TURNX_API.LEAD_RESPONSE, { ...data });
};

export const fetchLeads = async () => {
  return axiosInstance.get(TURNX_API.LEAD_RESPONSE);
};
