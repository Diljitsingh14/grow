import { PRODUCT_API } from "@/constants/urls";
import axiosInstance from "@/utils/http/axiosInstance";

export const getProducts = async (filter?: any) => {
  return axiosInstance.get(PRODUCT_API.PRODUCT_LIST);
};

export const getProductDetail = async (id: string) => {
  return axiosInstance.get(PRODUCT_API.PRODUCT_DETAIL.replace("##ID##", id));
};

export const getReviews = async (productId: string) => {
  return axiosInstance.get(
    `${PRODUCT_API.PRODUCT_REVIEW}?product=${productId}`
  );
};
