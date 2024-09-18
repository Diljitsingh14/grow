import { AUTH_API } from "@/constants/urls";
import axiosInstance from "@/utils/http/axiosInstance";

export const fetchConnectedOAuthAccounts = async () => {
  return axiosInstance.get(`${AUTH_API.CONNECT_OAUTH_ACCOUNT}`);
};
