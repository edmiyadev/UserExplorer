export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  city: string;
}

export interface CreateUserDto {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  city?: string;
}

export interface UserFilters {
  search?: string;
  city?: string;
  company?: string;
  page?: number;
  pageSize?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
