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
}
