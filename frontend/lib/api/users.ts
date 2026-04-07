import axios from 'axios';
import type { User, CreateUserDto, UserFilters, PaginatedResponse } from '@/lib/types/user';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5059';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const userApi = {
  // Get all users with optional filters and pagination
  getUsers: async (filters?: UserFilters): Promise<PaginatedResponse<User>> => {
    const params = new URLSearchParams();
    
    if (filters?.search) params.append('search', filters.search);
    if (filters?.city) params.append('city', filters.city);
    if (filters?.company) params.append('company', filters.company);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.pageSize) params.append('pageSize', filters.pageSize.toString());
    
    const { data } = await apiClient.get<PaginatedResponse<User>>(`/api/users?${params.toString()}`);
    return data;
  },

  // Get single user by ID
  getUser: async (id: number): Promise<User> => {
    const { data } = await apiClient.get<User>(`/api/users/${id}`);
    return data;
  },

  // Create new user
  createUser: async (userData: CreateUserDto): Promise<User> => {
    const { data } = await apiClient.post<User>('/api/users', userData);
    return data;
  },

  // Update existing user
  updateUser: async (id: number, userData: CreateUserDto): Promise<User> => {
    const { data } = await apiClient.put<User>(`/api/users/${id}`, userData);
    return data;
  },

  // Delete user
  deleteUser: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/users/${id}`);
  },

  // Get unique cities for filter (fetch all users to extract cities)
  getUniqueCities: async (): Promise<string[]> => {
    const { data } = await apiClient.get<PaginatedResponse<User>>('/api/users?pageSize=1000');
    const cities = [...new Set(data.data.map(user => user.city).filter(Boolean))];
    return cities.sort();
  },

  // Get unique companies for filter (fetch all users to extract companies)
  getUniqueCompanies: async (): Promise<string[]> => {
    const { data } = await apiClient.get<PaginatedResponse<User>>('/api/users?pageSize=1000');
    const companies = [...new Set(data.data.map(user => user.company).filter(Boolean))];
    return companies.sort();
  },
};
