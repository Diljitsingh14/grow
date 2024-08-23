import { CART } from "@/constants/cookies";
import { getCookie, setCookie } from "cookies-next";

export interface ICartItem {
  id: string;
  price: string;
  quantity: number;
  name: string;
  desc: string;
  imageUrl: string;
}

export const setCart = (item: ICartItem): void => {
  const cartItemsRaw = getCookie(CART) || "{}";

  try {
    let cartItem = JSON.parse(cartItemsRaw);
    cartItem = { ...cartItem, item };

    const cartItemJson = JSON.stringify(cartItem);
    setCookie(CART, cartItemJson);
  } catch (err) {
    console.error("ERROR at file:cart.ts fx:setCart : ", err);
  }
};

export const getCartItems = (): { [key: string]: ICartItem } | null => {
  const cartItemJson = getCookie(CART) || "";
  try {
    const cartItems = JSON.parse(cartItemJson);
    return cartItems;
  } catch (err) {
    console.error("ERROR at file:cart.ts fx:getCartItems : ", err);
    return null;
  }
};
