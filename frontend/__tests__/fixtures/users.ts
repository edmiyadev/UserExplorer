import type { User, CreateUserDto, PaginatedResponse } from '@/lib/types/user';

// Single Entities
export const mockUser: User = {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
  phone: '809-555-0001',
  company: 'Acme Corp',
  city: 'Santo Domingo',
};

export const mockUser2: User = {
  id: 2,
  name: 'Jane Smith',
  email: 'jane@example.com',
  phone: '809-555-0002',
  company: 'Globex Inc',
  city: 'Santiago',
};

export const mockCreateUserDto: CreateUserDto = {
  name: 'New User',
  email: 'new@example.com',
  phone: '809-555-0003',
  company: 'StartUp LLC',
  city: 'La Vega',
};

// Paginated Responses
export const mockPaginatedUsers: PaginatedResponse<User> = {
  data: [mockUser, mockUser2],
  page: 1,
  pageSize: 10,
  totalCount: 2,
  totalPages: 1,
  hasNextPage: false,
  hasPreviousPage: false,
};

export const mockEmptyPaginatedUsers: PaginatedResponse<User> = {
  data: [],
  page: 1,
  pageSize: 10,
  totalCount: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
};
