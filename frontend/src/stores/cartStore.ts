import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { MenuItem } from "../types/menu";

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isCartOpen: boolean;

  addItem: (cartItem: CartItem) => void;
  removeItem: (menuItemId: number) => void;
  updateQuantity: (menuItemId: number, quantity: number) => void;
  clearCart: () => void;
  setIsCartOpen: (isOpen: boolean) => void;

  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isCartOpen: false,

      // Add item to cart
      addItem: (cartItem) => {
        set((state) => {
          const { menuItem, quantity } = cartItem;

          // Item must be available
          if (
            menuItem.status !== "AVAILABLE" ||
            menuItem.availableCount <= 0 ||
            quantity <= 0
          ) {
            return state;
          }

          // Check if item already exists in cart
          const existingItem = state.items.find(
            (item) => item.menuItem.id === menuItem.id
          );

          // If item already exists
          if (existingItem) {
            const newQuantity = Math.min(
              existingItem.quantity + quantity,
              menuItem.availableCount
            );

            return {
              items: state.items.map((item) =>
                item.menuItem.id === menuItem.id
                  ? {
                      ...item,
                      quantity: newQuantity,
                    }
                  : item
              ),
            };
          }

          // If item does not exist, add it with selected quantity
          return {
            items: [
              ...state.items,
              {
                menuItem,
                quantity: Math.min(quantity, menuItem.availableCount),
              },
            ],
          };
        });
      },

      // Remove item completely from cart
      removeItem: (menuItemId) => {
        set((state) => ({
          items: state.items.filter((item) => item.menuItem.id !== menuItemId),
        }));
      },

      // Update quantity from cart
      updateQuantity: (menuItemId, quantity) => {
        // If quantity becomes 0, remove the item
        if (quantity <= 0) {
          set((state) => ({
            items: state.items.filter(
              (item) => item.menuItem.id !== menuItemId
            ),
          }));

          return;
        }

        set((state) => ({
          items: state.items.map((item) => {
            if (item.menuItem.id !== menuItemId) {
              return item;
            }

            // Never allow quantity above available stock
            const newQuantity = Math.min(
              quantity,
              item.menuItem.availableCount
            );

            return {
              ...item,
              quantity: newQuantity,
            };
          }),
        }));
      },

      // Clear entire cart
      clearCart: () => {
        set({
          items: [],
        });
      },

      setIsCartOpen: (isOpen) => {
        set({
          isCartOpen: isOpen,
        });
      },

      // Calculate total price
      getTotal: () => {
        return get().items.reduce(
          (total, item) => total + item.menuItem.price * item.quantity,
          0
        );
      },

      // Calculate total number of pieces
      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: "cart-store",
    }
  )
);
