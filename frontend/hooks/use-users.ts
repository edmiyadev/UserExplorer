import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { userApi } from '@/lib/api/users';
import { ApiError } from '@/lib/api/api-client';
import type { CreateUserDto, UserFilters, PaginatedResponse, User } from '@/lib/types/user';
import { toast } from 'sonner';
import { useTranslation } from '@/lib/i18n';


export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters?: UserFilters) => [...userKeys.lists(), filters] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: number) => [...userKeys.details(), id] as const,
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


export function useCreateUser() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (userData: CreateUserDto) => userApi.createUser(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      
      toast.success(t.toast.userCreated);
    },
    onError: (error: ApiError) => {
      toast.error(error.message || t.toast.createError);
    },
  });
}


export function useUpdateUser() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CreateUserDto }) => 
      userApi.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.details() });
      
      toast.success(t.toast.userUpdated);
    },
    onError: (error: ApiError) => {
      toast.error(error.message || t.toast.updateError);
    },
  });
}


export function useDeleteUser() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (id: number) => userApi.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      
      toast.success(t.toast.userDeleted);
    },
    onError: (error: ApiError) => {
      toast.error(error.message || t.toast.deleteError);
    },
  });
}
