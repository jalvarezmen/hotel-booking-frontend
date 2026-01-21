// Enums
export enum ReservationStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
}

export enum RoomType {
  STANDARD = 'STANDARD',
  SUPERIOR = 'SUPERIOR',
  DELUXE = 'DELUXE',
  SUITE = 'SUITE',
}

export enum PaymentMethod {
  CASH = 'CASH',
  CARD = 'CARD',
  TRANSFER = 'TRANSFER',
}

// Interfaces
export interface Guest {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  documentNumber: string;
  email: string;
  phone: string;
  createdAt: string;
}

export interface Room {
  id: number;
  roomNumber: string;
  roomType: RoomType;
  capacity: number;
  pricePerNight: number;
  isAvailable: boolean;
}

export interface Reservation {
  id: number;
  reservationNumber: string;
  guest: Guest;
  room: Room;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  numberOfNights: number;
  totalAmount: number;
  status: ReservationStatus;
  createdAt: string;
  checkInTime: string | null;
  checkOutTime: string | null;
}

export interface TodayReservations {
  checkIns: Reservation[];
  checkOuts: Reservation[];
}

export interface CreateReservationDTO {
  guest: {
    firstName: string;
    lastName: string;
    documentNumber: string;
    email: string;
    phone: string;
  };
  roomId: number;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
}

export interface PaymentConfirmationDTO {
  paymentMethod: PaymentMethod;
  amount: number;
  reference?: string;
}

export interface CancelReservationDTO {
  reason: string;
}

export interface CancelReservationResponse {
  message: string;
  refundAmount: number;
  penaltyAmount: number;
}

export interface User {
  username: string;
  role: 'gerente' | 'recepcionista';
}
