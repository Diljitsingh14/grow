"use client";

import { createContext, useContext, ReactNode, useReducer, useEffect } from "react";
import { getCookie } from "cookies-next";
import { TOKENS } from "@/constants/cookies";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

type CartState = {
  items: CartItem[];
}

type CartContextType = {
  state: CartState;
  loadState: (state: CartState) => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
}

type ActionType = "Add-Item-To-Cart" | "Remove-Item-From-Cart" | "Clear-Cart" | "Load-State" | "Increase-Quantity" | "Decrease-Quantity";
type Action = { type: ActionType; payload?: CartItem | string | CartState };

const CartContext = createContext<CartContextType | undefined>(undefined);

function cartReducer(state: CartState, action: Action): CartState {
  switch (action.type) {
    case "Load-State": {
      return { ...action.payload as CartState };
    }

    case "Add-Item-To-Cart": {
      return { ...state, items: [...state.items, action.payload as CartItem] };
    }

    case "Clear-Cart": {
      return { ...state, items: [] };
    }

    case "Remove-Item-From-Cart": {
      return { ...state, items: state.items.filter((item: CartItem) => item.id != action.payload) };
    }

    case "Increase-Quantity": {
      const items = state.items.map(x => {
        if (x.id == action.payload)
          x.quantity++;
        return x;
      });

      return { ...state, items };
    }

    case "Decrease-Quantity": {
      const items = state.items.flatMap(x => {
        if (x.id == action.payload)
          x.quantity--;

        if (x.quantity <= 0)
          return [];
        
        return [x];
      });

      return { ...state, items };
    }

    default: return state;
  }
}

const useCartReducer = (initalState: CartState = { items: [] }): CartContextType => {
  const [state, dispatcher] = useReducer(cartReducer, initalState);

  const addToCart = (item: CartItem) => {
    dispatcher({ type: "Add-Item-To-Cart", payload: item });
  }

  const removeFromCart = (id: string) => {
    dispatcher({ type: "Remove-Item-From-Cart", payload: id });
  }

  const loadState = (state: CartState) => {
    dispatcher({ type: "Load-State", payload: state });
  }

  const increaseQuantity = (id: string) => {
    dispatcher({ type: "Increase-Quantity", payload: id });
  }

  const decreaseQuantity = (id: string) => {
    dispatcher({ type: "Decrease-Quantity", payload: id });
  }

  const clearCart = () => dispatcher({ type: "Clear-Cart" });

  return { loadState, clearCart, addToCart, removeFromCart, increaseQuantity, decreaseQuantity, state };
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { state, loadState, ...actions } = useCartReducer();
  const isUserLoggedIn: boolean = !!getCookie(TOKENS.ACCESS);
  const cartKey: string = "cart-state";

  useEffect(() => {
    if (!isUserLoggedIn) {
      const cartState = localStorage.getItem(cartKey);
      !!cartState && loadState(JSON.parse(cartState) as CartState);
    }
    /** else make api request to fetch user cart */
  }, []);

  useEffect(() => {
    localStorage.setItem(cartKey, JSON.stringify(state));
  }, [state]);

  return (
    <CartContext.Provider value={{ state, loadState, ...actions }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = (): CartContextType => {
  const context: CartContextType | undefined = useContext(CartContext);

  if (!context)
    throw new Error("Unable to load cart context, are you using useCart hook inside cart provider?");

  return context;
}