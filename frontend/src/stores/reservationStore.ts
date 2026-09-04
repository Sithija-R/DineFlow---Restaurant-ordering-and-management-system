import { create } from "zustand";

import type {
  RestaurantTable,
  ReservationRequest,
  ReservationResponse,
  ReservationStatus,
} from "../types/reservation";

import {
  getTables,
  createReservation,
  getReservationById,
  getReservationByReference,
  getReservationsByDate,
  getAllReservations,
  updateReservationStatus,
} from "../service/reservationService";

interface ReservationState {
  tables: RestaurantTable[];
  reservations: ReservationResponse[];
  selectedReservation: ReservationResponse | null;

  loading: boolean;
  error: string | null;

  fetchTables: () => Promise<void>;
  createReservation: (request: ReservationRequest) => Promise<ReservationResponse>;
  fetchReservation: (id: number) => Promise<void>;
  fetchReservationByReference: (reference: string) => Promise<ReservationResponse>;
  fetchReservationsByDate: (date: string) => Promise<void>;
  fetchAllReservations: () => Promise<void>;
  updateStatus: (id: number, status: ReservationStatus) => Promise<void>;

  clearSelectedReservation: () => void;
  clearError: () => void;
}

export const useReservationStore = create<ReservationState>((set) => ({
  tables: [],
  reservations: [],
  selectedReservation: null,

  loading: false,
  error: null,

  fetchTables: async () => {
    try {
      set({ loading: true, error: null });

      const tables = await getTables();

      set({
        tables,
        loading: false,
      });
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to load tables";

      set({
        loading: false,
        error: message,
      });

      throw new Error(message);
    }
  },

  createReservation: async (request: ReservationRequest) => {
    try {
      set({ loading: true, error: null });

      const reservation = await createReservation(request);

      set({
        selectedReservation: reservation,
        loading: false,
      });

      return reservation;
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to create reservation";

      set({
        loading: false,
        error: message,
      });

      throw new Error(message);
    }
  },

  fetchReservation: async (id: number) => {
    try {
      set({ loading: true, error: null });

      const reservation = await getReservationById(id);

      set({
        selectedReservation: reservation,
        loading: false,
      });
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to load reservation";

      set({
        loading: false,
        error: message,
      });

      throw new Error(message);
    }
  },


  fetchReservationByReference: async (reference: string) => {
    try {
      set({
        loading: true,
        error: null,
      });

      const reservation = await getReservationByReference(reference);

      set({
        loading: false,
      });

      return reservation;
    } catch (error: any) {
      const message = error.response?.data?.message || "Reservation not found";

      set({
        loading: false,
        error: message,
      });

      throw new Error(message);
    }
  },

  fetchReservationsByDate: async (date: string) => {
    try {
      set({
        loading: true,
        error: null,
      });

      const reservations = await getReservationsByDate(date);

      set({
        reservations,
        loading: false,
      });
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to load reservations";

      set({
        loading: false,
        error: message,
      });

      throw new Error(message);
    }
  },

  fetchAllReservations: async () => {
    try {
      set({
        loading: true,
        error: null,
      });

      const reservations = await getAllReservations();

      set({
        reservations,
        loading: false,
      });
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to load reservations";

      set({
        loading: false,
        error: message,
      });

      throw new Error(message);
    }
  },

  updateStatus: async (id: number, status: ReservationStatus) => {
    try {
      set({
        loading: true,
        error: null,
      });

      const updated = await updateReservationStatus(id, status);

      set((state) => ({
        reservations: state.reservations.map((reservation) =>
          reservation.id === id ? updated : reservation
        ),

        selectedReservation:
          state.selectedReservation?.id === id
            ? updated
            : state.selectedReservation,

        loading: false,
      }));
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to update reservation";

      set({
        loading: false,
        error: message,
      });

      throw new Error(message);
    }
  },

  clearSelectedReservation: () => {
    set({
      selectedReservation: null,
    });
  },

  clearError: () => {
    set({
      error: null,
    });
  },
}));
