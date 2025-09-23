// components/cart/CartProvider.tsx
"use client";

import React, { createContext, useContext, useEffect, useReducer, useRef } from "react";

type CartItem = {
  id: string;               // unique id for cart entry (productId + size) 
  productId: string;
  title: string;
  variantId?: string;
  price: number;
  originalPrice?: number;
  image?: string;
  size?: string;
  color?: string;
  quantity: number;
  minOrderQuantity?: number;
  inStock?: boolean;
};

type CartState = {
  items: CartItem[];
  initialized: boolean;
};

type Action =
  | { type: "SET_ITEMS"; items: CartItem[] }
  | { type: "ADD_ITEM"; item: CartItem }
  | { type: "REMOVE_ITEM"; id: string }
  | { type: "UPDATE_QUANTITY"; id: string; quantity: number }
  | { type: "CLEAR_CART" };

const LOCAL_STORAGE_KEY = "vijay_cart_v1";

const initialState: CartState = { items: [], initialized: false };

function cartReducer(state: CartState, action: Action): CartState {
  switch (action.type) {
    case "SET_ITEMS":
      return { ...state, items: action.items, initialized: true };
    case "ADD_ITEM": {
      const incoming = action.item;
      // merge by unique key (productId + size)
      const key = (it: CartItem) => `${it.productId}::${it.size ?? ""}`;
      const idx = state.items.findIndex((it) => key(it) === key(incoming));

      if (idx >= 0) {
        // increment quantity but respect minOrderQuantity
        const updated = [...state.items];
        updated[idx] = {
          ...updated[idx],
          quantity: Math.max(updated[idx].minOrderQuantity ?? 1, updated[idx].quantity + incoming.quantity)
        };
        return { ...state, items: updated };
      } else {
        return { ...state, items: [...state.items, incoming] };
      }
    }
    case "REMOVE_ITEM":
      return { ...state, items: state.items.filter((i) => i.id !== action.id) };
    case "UPDATE_QUANTITY": {
      const updated = state.items.map((it) =>
        it.id === action.id ? { ...it, quantity: Math.max(it.minOrderQuantity ?? 1, action.quantity) } : it
      );
      return { ...state, items: updated };
    }
    case "CLEAR_CART":
      return { ...state, items: [] };
    default:
      return state;
  }
}

type CartContextType = {
  items: CartItem[];
  initialized: boolean;
  addItem: (payload: Omit<CartItem, "id">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getItemCount: () => number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const saveTimeout = useRef<number | null>(null);

  // Load from localStorage once on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (raw) {
        const parsed: CartItem[] = JSON.parse(raw);
        dispatch({ type: "SET_ITEMS", items: parsed });
      } else {
        dispatch({ type: "SET_ITEMS", items: [] });
      }
    } catch (err) {
      console.error("Failed to load cart from storage", err);
      dispatch({ type: "SET_ITEMS", items: [] });
    }
  }, []);

  // Save to localStorage (debounced)
  useEffect(() => {
    if (!state.initialized) return;
    if (saveTimeout.current) window.clearTimeout(saveTimeout.current);
    saveTimeout.current = window.setTimeout(() => {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state.items));
      } catch (err) {
        console.error("Failed to save cart to localStorage", err);
      }
    }, 300);
    return () => {
      if (saveTimeout.current) window.clearTimeout(saveTimeout.current);
    };
  }, [state.items, state.initialized]);

  // Sync across tabs using storage event
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== LOCAL_STORAGE_KEY) return;
      try {
        const newItems = e.newValue ? JSON.parse(e.newValue) : [];
        dispatch({ type: "SET_ITEMS", items: newItems });
      } catch (err) {
        console.error("Failed to parse storage event for cart", err);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const makeId = (productId: string, size?: string) => `${productId}::${size ?? ""}`;

  const api: CartContextType = {
    items: state.items,
    initialized: state.initialized,
    addItem: (payload) => {
      const id = makeId(payload.productId, payload.size);
      const item = { ...payload, id };
      dispatch({ type: "ADD_ITEM", item });
    },
    removeItem: (id) => dispatch({ type: "REMOVE_ITEM", id }),
    updateQuantity: (id, quantity) => dispatch({ type: "UPDATE_QUANTITY", id, quantity }),
    clearCart: () => dispatch({ type: "CLEAR_CART" }),
    getSubtotal: () => state.items.reduce((s, it) => s + it.price * it.quantity, 0),
    getItemCount: () => state.items.reduce((s, it) => s + it.quantity, 0),
  };

  return <CartContext.Provider value={api}>{children}</CartContext.Provider>;
};

export function useCart(): CartContextType {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
