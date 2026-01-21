import api from './api';
import type {
  Reservation,
  TodayReservations,
  CreateReservationDTO,
  PaymentConfirmationDTO,
  CancelReservationDTO,
  CancelReservationResponse,
} from './types';

export const reservationsApi = {
  // Obtener reservas del día
  getToday: async (): Promise<TodayReservations> => {
    const { data } = await api.get<TodayReservations>('/reservations/today');
    return data;
  },

  // Crear reserva
  create: async (reservation: CreateReservationDTO): Promise<Reservation> => {
    const { data } = await api.post<Reservation>('/reservations', reservation);
    return data;
  },

  // Buscar por número de reserva
  searchByNumber: async (reservationNumber: string): Promise<Reservation> => {
    const { data } = await api.get<Reservation>(`/reservations/search`, {
      params: { reservationNumber },
    });
    return data;
  },

  // Buscar por nombre de huésped
  searchByGuestName: async (guestName: string): Promise<Reservation[]> => {
    const { data } = await api.get<Reservation[]>(`/reservations/search`, {
      params: { guestName },
    });
    return data;
  },

  // Obtener por ID
  getById: async (id: number): Promise<Reservation> => {
    const { data } = await api.get<Reservation>(`/reservations/${id}`);
    return data;
  },

  // Confirmar pago
  confirmPayment: async (
    id: number,
    payment: PaymentConfirmationDTO
  ): Promise<Reservation> => {
    const { data } = await api.post<Reservation>(
      `/reservations/${id}/confirm-payment`,
      payment
    );
    return data;
  },

  // Check-in
  checkIn: async (id: number): Promise<Reservation> => {
    const { data } = await api.post<Reservation>(`/reservations/${id}/checkin`);
    return data;
  },

  // Check-out
  checkOut: async (id: number): Promise<Reservation> => {
    const { data } = await api.post<Reservation>(`/reservations/${id}/checkout`);
    return data;
  },

  // Cancelar reserva
  cancel: async (
    id: number,
    cancelData: CancelReservationDTO
  ): Promise<CancelReservationResponse> => {
    const { data } = await api.post<CancelReservationResponse>(
      `/reservations/${id}/cancel`,
      cancelData
    );
    return data;
  },
};
