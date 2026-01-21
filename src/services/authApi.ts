import api from './api';
import type {
  LoginRequest,
  LoginResponse,
  User,
  CreateUserRequest,
  UpdateUserRequest,
} from './types';

export const authApi = {
  // Login
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const { data } = await api.post<LoginResponse>('/auth/login', credentials);
    return data;
  },

  // Gestión de usuarios (solo administrador)
  getUsers: async (): Promise<User[]> => {
    const { data } = await api.get<User[]>('/users');
    return data;
  },

  getUserById: async (id: number): Promise<User> => {
    const { data } = await api.get<User>(`/users/${id}`);
    return data;
  },

  createUser: async (user: CreateUserRequest): Promise<User> => {
    const { data } = await api.post<User>('/users', user);
    return data;
  },

  updateUser: async (id: number, user: UpdateUserRequest): Promise<User> => {
    const { data } = await api.put<User>(`/users/${id}`, user);
    return data;
  },

  deleteUser: async (id: number): Promise<void> => {
    await api.delete(`/users/${id}`);
  },

  getUsersByRole: async (role: string): Promise<User[]> => {
    const { data } = await api.get<User[]>(`/users/role/${role}`);
    return data;
  },
};

