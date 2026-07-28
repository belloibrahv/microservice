"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { CartItem, User } from "@/lib/types";

type PublicUser = Omit<User, "password">;

type AppState = {
  token: string | null;
  user: PublicUser | null;
  cart: CartItem[];
  setSession: (token: string, user: PublicUser) => void;
  signOut: () => void;
  addToCart: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      cart: [],
      setSession: (token: string, user: PublicUser) => set({ token, user }),
      signOut: () => set({ token: null, user: null, cart: [] }),
      addToCart: (productId: string) =>
        set((state: AppState) => {
          const existing = state.cart.find((item: CartItem) => item.productId === productId);
          if (existing) {
            return {
              cart: state.cart.map((item: CartItem) =>
                item.productId === productId
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          }

          return {
            cart: [...state.cart, { productId, quantity: 1 }],
          };
        }),
      setQuantity: (productId: string, quantity: number) =>
        set((state: AppState) => ({
          cart:
            quantity <= 0
              ? state.cart.filter((item: CartItem) => item.productId !== productId)
              : state.cart.map((item: CartItem) =>
                  item.productId === productId ? { ...item, quantity } : item
                ),
        })),
      clearCart: () => set({ cart: [] }),
    }),
    {
      name: "microservices-retail-app",
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        cart: state.cart,
      }),
    }
  )
);
