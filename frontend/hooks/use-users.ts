import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { userApi } from '@/lib/api/users';
import type { CreateUserDto, UserFilters, PaginatedResponse, User } from '@/lib/types/user';
import { toast } from 'sonner';


export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters?: UserFilters) => [...userKeys.lists(), filters] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: number) => [...userKeys.details(), id] as const,
  cities: () => ['cities'] as const,
  companies: () => ['companies'] as const,
};


export function useUsers(filters?: UserFilters) {
  return useQuery<PaginatedResponse<User>>({
    queryKey: userKeys.list(filters),
    queryFn: () => userApi.getUsers(filters),
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
}


export function useUser(id: number) {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => userApi.getUser(id),
    enabled: !!id,
  });
}


export function useCities() {
  return useQuery({
    queryKey: userKeys.cities(),
    queryFn: () => userApi.getUniqueCities(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}


export function useCompanies() {
  return useQuery({
    queryKey: userKeys.companies(),
    queryFn: () => userApi.getUniqueCompanies(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}


export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: CreateUserDto) => userApi.createUser(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.cities() });
      queryClient.invalidateQueries({ queryKey: userKeys.companies() });
      
      toast.success('User created successfully');
    },
    onError: (error: Error & { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || 'Failed to create user');
    },
  });
}


export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CreateUserDto }) => 
      userApi.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.details() });
      queryClient.invalidateQueries({ queryKey: userKeys.cities() });
      queryClient.invalidateQueries({ queryKey: userKeys.companies() });
      
      toast.success('User updated successfully');
    },
    onError: (error: Error & { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || 'Failed to update user');
    },
  });
}


export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => userApi.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.cities() });
      queryClient.invalidateQueries({ queryKey: userKeys.companies() });
      
      toast.success('User deleted successfully');
    },
    onError: (error: Error & { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || 'Failed to delete user');
    },
  });
}
