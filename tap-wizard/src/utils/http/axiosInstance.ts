import { TOKENS } from "@/constants/cookies";
import { LOGIN_REDIRECT_ROUTE } from "@/constants/routes";
import { AUTH_API } from "@/constants/urls";
import axios from "axios";
import { getCookie, setCookie, deleteCookie } from "cookies-next";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(async (config) => {
  const token = await getCookie(TOKENS.ACCESS);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status == 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = getCookie(TOKENS.REFRESH);

      try {
        const response = await axiosInstance.post(AUTH_API.REFRESH_TOKEN_URL, {
          refresh: refreshToken,
        });

        const { access } = response.data;
        setCookie(TOKENS.ACCESS, access);
        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${access}`;
        return axiosInstance(originalRequest);
      } catch (err) {
        deleteCookie(TOKENS.ACCESS);
        deleteCookie(TOKENS.REFRESH);
        window.location.href = LOGIN_REDIRECT_ROUTE;
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
