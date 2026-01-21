import api from './api';
import type { Room } from './types';

export const roomsApi = {
  // Obtener todas las habitaciones
  getAll: async (): Promise<Room[]> => {
    const { data } = await api.get<Room[]>('/rooms');
    return data;
  },

  // Obtener habitaciones disponibles
  getAvailable: async (
    checkInDate: string,
    checkOutDate: string,
    numberOfGuests?: number
  ): Promise<Room[]> => {
    const { data } = await api.get<Room[]>('/rooms/available', {
      params: { checkInDate, checkOutDate, numberOfGuests },
    });
    return data;
  },

  // Obtener por ID
  getById: async (id: number): Promise<Room> => {
    const { data } = await api.get<Room>(`/rooms/${id}`);
    return data;
  },

  // Crear habitación
  create: async (room: Omit<Room, 'id' | 'isAvailable'>): Promise<Room> => {
    const { data } = await api.post<Room>('/rooms', room);
    return data;
  },

  // Actualizar habitación
  update: async (id: number, room: Partial<Room>): Promise<Room> => {
    const { data } = await api.put<Room>(`/rooms/${id}`, room);
    return data;
  },

  // Eliminar habitación
  delete: async (id: number): Promise<void> => {
    await api.delete(`/rooms/${id}`);
  },
};
