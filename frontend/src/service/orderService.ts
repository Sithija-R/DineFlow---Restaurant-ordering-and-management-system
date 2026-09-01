import { orderClient } from "./api";
import type {
  OrderRequest,
  OrderResponse,
  OrderStatus,
  OrderStatusRequest,
} from "../types/order";

export const createOrder = async (
  request: OrderRequest
): Promise<OrderResponse> => {
  const response = await orderClient.post<OrderResponse>(
    "/api/orders",
    request
  );

  return response.data;
};

export const getOrderByReference = async (
  reference: string
): Promise<OrderResponse> => {
  const response = await orderClient.get<OrderResponse>(
    `/api/orders/${reference}`
  );

  return response.data;
};

export const getAllOrders = async (
  status?: OrderStatus
): Promise<OrderResponse[]> => {
  const response = await orderClient.get<OrderResponse[]>(
    "/api/orders", {
    params: status ? { status } : undefined,
  });

  return response.data;
};

export const updateOrderStatus = async (
  id: number,
  status: OrderStatus
): Promise<OrderResponse> => {
  const request: OrderStatusRequest = {
    status,
  };

  const response = await orderClient.patch<OrderResponse>(
    `/api/orders/${id}/status`,
    request
  );

  return response.data;
};
