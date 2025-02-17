// utils/auth/checkAuth.ts
import { AUTH_API } from "@/constants/urls";
import axiosInstance from "@/utils/http/axiosInstance";

const checkAuth = async () => {
  try {
    const response = await axiosInstance.get(AUTH_API.PING);
    return response?.data;
  } catch (error) {
    // console.error("Error checking auth status:", error);
    return null;
  }
};

export default checkAuth;
