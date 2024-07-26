import { TOKENS } from "@/constants/cookies";
import { LOGIN_ROUTE } from "@/constants/routes";
import { deleteCookie } from "cookies-next";

export const logout = () => {
  deleteCookie(TOKENS.ACCESS);
  deleteCookie(TOKENS.REFRESH);
  window.location.href = LOGIN_ROUTE;
};
