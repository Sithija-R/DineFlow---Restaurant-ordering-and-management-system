import { create } from "zustand";

import {
  createOrder as createOrderApi,
  getAllOrders as getAllOrdersApi,
  getOrderByReference as getOrderByReferenceApi,
  updateOrderStatus as updateOrderStatusApi,
} from "../service/orderService";

import type {
  OrderRequest,
  OrderResponse,
  OrderStatus,
} from "../types/order";

interface OrderState {
  orders: OrderResponse[];
  currentOrder: OrderResponse | null;

  loading: boolean;
  error: string | null;

  createOrder: (
    request: OrderRequest
  ) => Promise<OrderResponse>;

  getOrderByReference: (
    reference: string
  ) => Promise<OrderResponse>;

  fetchOrders: (
    status?: OrderStatus
  ) => Promise<void>;

  updateOrderStatus: (
    id: number,
    status: OrderStatus
  ) => Promise<void>;

  clearCurrentOrder: () => void;
  clearError: () => void;
}

export const useOrderStore = create<OrderState>((set) => ({
  orders: [],
  currentOrder: null,

  loading: false,
  error: null,

  createOrder: async (request) => {
    set({
      loading: true,
      error: null,
    });

    try {
      const order = await createOrderApi(request);

      set({
        currentOrder: order,
        loading: false,
      });

      return order;
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        "Failed to place order.";

      set({
        loading: false,
        error: message,
      });

      throw new Error(message);
    }
  },

  getOrderByReference: async (reference) => {
    set({
      loading: true,
      error: null,
    });

    try {
      const order =
        await getOrderByReferenceApi(reference);

      set({
        currentOrder: order,
        loading: false,
      });

      return order;
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        "Order not found.";

      set({
        loading: false,
        error: message,
        currentOrder: null,
      });

      throw new Error(message);
    }
  },

  fetchOrders: async (status) => {
    set({
      loading: true,
      error: null,
    });

    try {
      const orders = await getAllOrdersApi(status);

      set({
        orders,
        loading: false,
      });
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        "Failed to load orders.";

      set({
        loading: false,
        error: message,
      });

      throw new Error(message);
    }
  },

  updateOrderStatus: async (id, status) => {
    set({
      loading: true,
      error: null,
    });

    try {
      const updatedOrder =
        await updateOrderStatusApi(id, status);

      set((state) => ({
        orders: state.orders.map((order) =>
          order.id === id
            ? updatedOrder
            : order
        ),
        currentOrder:
          state.currentOrder?.id === id
            ? updatedOrder
            : state.currentOrder,
        loading: false,
      }));
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        "Failed to update order status.";

      set({
        loading: false,
        error: message,
      });

      throw new Error(message);
    }
  },

  clearCurrentOrder: () => {
    set({
      currentOrder: null,
    });
  },

  clearError: () => {
    set({
      error: null,
    });
  },
}));