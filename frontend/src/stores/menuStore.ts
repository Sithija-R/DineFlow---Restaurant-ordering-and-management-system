import { create } from "zustand";
import {
  createCategory as createCategoryApi,
  createMenuItem as createMenuItemApi,
  deleteCategory as deleteCategoryApi,
  deleteMenuItem as deleteMenuItemApi,
  getCategories,
  getMenuItems,
  updateCategory as updateCategoryApi,
  updateItemAvailability,
  updateMenuItem as updateMenuItemApi,
} from "../service/menuService";

import type {
  AvailabilityStatus,
  Category,
  CategoryRequest,
  MenuItem,
  MenuItemRequest,
} from "../types/menu";

interface MenuState {
  menuItems: MenuItem[];
  categories: Category[];

  loading: boolean;
  error: string | null;

  fetchMenuItems: () => Promise<void>;
  fetchCategories: () => Promise<void>;

  createMenuItem: (request: MenuItemRequest) => Promise<void>;
  updateMenuItem: (id: number, request: MenuItemRequest) => Promise<void>;
  deleteMenuItem: (id: number) => Promise<void>;

  createCategory: (request: CategoryRequest) => Promise<void>;
  updateCategory: (id: number, request: CategoryRequest) => Promise<void>;
  deleteCategory: (id: number) => Promise<void>;
  updateAvailabilityStatus: ( id: number, status: AvailabilityStatus) => Promise<MenuItem>;
  clearError: () => void;
}

export const useMenuStore = create<MenuState>((set) => ({
  menuItems: [],
  categories: [],

  loading: false,
  error: null,

  fetchMenuItems: async () => {
    set({
      loading: true,
      error: null,
    });

    try {
      const menuItems = await getMenuItems();
      set({
        menuItems,
        loading: false,
      });
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to load menu items.";

      set({
        loading: false,
        error: message,
      });

      throw new Error(message);
    }
  },

  fetchCategories: async () => {
    set({
      loading: true,
      error: null,
    });

    try {
      const categories = await getCategories();

      set({
        categories,
        loading: false,
      });
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to load categories.";

      set({
        loading: false,
        error: message,
      });

      throw new Error(message);
    }
  },

  createMenuItem: async (request) => {
    set({
      loading: true,
      error: null,
    });

    try {
      const menuItem = await createMenuItemApi(request);

      set((state) => ({
        menuItems: [...state.menuItems, menuItem],
        loading: false,
      }));
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to create menu item.";

      set({
        loading: false,
        error: message,
      });

      throw new Error(message);
    }
  },

  updateMenuItem: async (id, request) => {
    set({
      loading: true,
      error: null,
    });

    try {
      const updatedItem = await updateMenuItemApi(id, request);

      set((state) => ({
        menuItems: state.menuItems.map((item) =>
          item.id === id ? updatedItem : item
        ),
        loading: false,
      }));
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to update menu item.";

      set({
        loading: false,
        error: message,
      });

      throw new Error(message);
    }
  },

  deleteMenuItem: async (id) => {
    set({
      loading: true,
      error: null,
    });

    try {
      await deleteMenuItemApi(id);

      set((state) => ({
        menuItems: state.menuItems.filter((item) => item.id !== id),
        loading: false,
      }));
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to delete menu item.";

      set({
        loading: false,
        error: message,
      });

      throw new Error(message);
    }
  },

  createCategory: async (request) => {
    set({
      loading: true,
      error: null,
    });

    try {
      const category = await createCategoryApi(request);

      set((state) => ({
        categories: [...state.categories, category],
        loading: false,
      }));
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to create category.";

      set({
        loading: false,
        error: message,
      });

      throw new Error(message);
    }
  },

  updateCategory: async (id, request) => {
    set({
      loading: true,
      error: null,
    });

    try {
      const updatedCategory = await updateCategoryApi(id, request);

      set((state) => ({
        categories: state.categories.map((category) =>
          category.id === id ? updatedCategory : category
        ),
        loading: false,
      }));
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to update category.";

      set({
        loading: false,
        error: message,
      });

      throw new Error(message);
    }
  },

  deleteCategory: async (id) => {
    set({
      loading: true,
      error: null,
    });

    try {
      await deleteCategoryApi(id);

      set((state) => ({
        categories: state.categories.filter((category) => category.id !== id),
        loading: false,
      }));
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to delete category.";

      set({
        loading: false,
        error: message,
      });

      throw new Error(message);
    }
  },

  updateAvailabilityStatus: async (id, status) => {
    set({ loading: true, error: null });
    try {
      const updatedMenuItem = await updateItemAvailability(id, status);
      set((state) => ({
        menuItems: state.menuItems.map((item) =>
          item.id === id ? updatedMenuItem : item
        ),
        loading: false,
      }));
      return updatedMenuItem;

    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to update item availability.";
      set({ loading: false, error: message });
      throw new Error(message);
    }
  },

  clearError: () => {
    set({
      error: null,
    });
  },
}));
