
export type OrderType = "DINE_IN" | "TAKEAWAY";

export type OrderStatus =
  | "PLACED"
  | "CONFIRMED"
  | "PREPARING"
  | "READY"
  | "COMPLETED"
  | "CANCELLED";

export interface OrderItemRequest {
  menuItemId: number;
  quantity: number;
}

export interface OrderRequest {
  customerName: string;
  phoneNumber: string;
  orderType: OrderType;
  tableNumber?: number;
  items: OrderItemRequest[];
}

export interface OrderItemResponse {
  menuItemId: number;
  menuItemName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface OrderResponse {
  id: number;
  orderReference: string;
  customerName: string;
  phoneNumber: string;
  orderType: OrderType;
  status: OrderStatus;
  total: number;
  createdAt: string;
  items: OrderItemResponse[];
}

export interface OrderStatusRequest {
  status: OrderStatus;
}
