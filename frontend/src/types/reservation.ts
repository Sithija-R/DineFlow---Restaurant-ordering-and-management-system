export type ReservationStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CANCELLED";

export interface RestaurantTable {
  id: number;
  tableNumber: number;
}

export interface ReservationRequest {
  date: string;
  startTime: string;
  endTime: string;
  tableId: number;
  customerName: string;
  phoneNumber: string;
}

export interface ReservationResponse {
  id: number;
  reservationReference: string;
  date: string;
  startTime: string;
  endTime: string;
  tableId: number;
  tableNumber: number;
  customerName: string;
  phoneNumber: string;
  status: ReservationStatus;
  createdAt: string;
}