import { orderClient } from "./api";

import type {
  RestaurantTable,
  ReservationRequest,
  ReservationResponse,
  ReservationStatus,
} from "../types/reservation";

export const getTables = async (): Promise<RestaurantTable[]> => {
  const response = await orderClient.get<RestaurantTable[]>(
    "/api/tables"
  );

  return response.data;
};

export const getTable = async (
  id: number
): Promise<RestaurantTable> => {
  const response = await orderClient.get<RestaurantTable>(
    `/api/tables/${id}`
  );

  return response.data;
};

export const createReservation = async (
  request: ReservationRequest
): Promise<ReservationResponse> => {
  const response = await orderClient.post<ReservationResponse>(
    "/api/reservations",
    request
  );

  return response.data;
};

export const getReservationById = async (
  id: number
): Promise<ReservationResponse> => {
  const response = await orderClient.get<ReservationResponse>(
    `/api/reservations/${id}`
  );

  return response.data;
};

export const getReservationsByDate = async (
  date: string
): Promise<ReservationResponse[]> => {
  const response = await orderClient.get<ReservationResponse[]>(
    "/api/reservations",
    {
      params: { date },
    }
  );

  return response.data;
};

export const getReservationByReference = async (
    reference: string
  ): Promise<ReservationResponse> => {
    const response = await orderClient.get<ReservationResponse>(
        `/api/reservations/reference/${reference}`
    );
  
    return response.data;
  };

export const getAllReservations = async (): Promise<
  ReservationResponse[]
> => {
  const response = await orderClient.get<ReservationResponse[]>(
    "/api/reservations"
  );

  return response.data;
};

export const updateReservationStatus = async (
  id: number,
  status: ReservationStatus
): Promise<ReservationResponse> => {
  const response = await orderClient.patch<ReservationResponse>(
    `/api/reservations/${id}/status`,
    null,
    {
      params: { status },
    }
  );

  return response.data;
};