import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { MenuItem } from "../types/menu";

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

interface CartState {
  items: CartItem[];

  addItem: (menuItem: MenuItem) => void;
  removeItem: (menuItemId: number) => void;
  updateQuantity: (menuItemId: number, quantity: number) => void;
  clearCart: () => void;

  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (menuItem) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.menuItem.id === menuItem.id
          );


          if (existingItem) {
            if (
              existingItem.quantity >= menuItem.availableCount
            ) {
              return state;
            }

            return {
              items: state.items.map((item) =>
                item.menuItem.id === menuItem.id
                  ? {
                      ...item,
                      quantity: item.quantity + 1,
                    }
                  : item
              ),
            };
          }

          if (
            menuItem.status !== "AVAILABLE" ||
            menuItem.availableCount <= 0
          ) {
            return state;
          }

          return {
            items: [
              ...state.items,
              {
                menuItem,
                quantity: 1,
              },
            ],
          };
        });
      },

      removeItem: (menuItemId) => {
        set((state) => ({
          items: state.items.filter(
            (item) => item.menuItem.id !== menuItemId
          ),
        }));
      },

      updateQuantity: (menuItemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(menuItemId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) => {
            if (item.menuItem.id !== menuItemId) {
              return item;
            }

            const maxQuantity =
              item.menuItem.availableCount;

            return {
              ...item,
              quantity: Math.min(quantity, maxQuantity),
            };
          }),
        }));
      },

      clearCart: () => {
        set({
          items: [],
        });
      },

      getTotal: () => {
        return get().items.reduce(
          (total, item) =>
            total +
            item.menuItem.price * item.quantity,
          0
        );
      },

      getItemCount: () => {
        return get().items.reduce(
          (count, item) => count + item.quantity,
          0
        );
      },
    }),
    {
      name: "cart-store",
    }
  )
);