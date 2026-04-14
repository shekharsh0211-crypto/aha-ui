import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export function useUsers(search = '', page = 0, size = 20) {
  return useQuery({
    queryKey: ['users', search, page, size],
    queryFn: async () => {
      const params = new URLSearchParams({ page: String(page), size: String(size) });
      if (search) params.set('search', search);
      const res = await api.get(`/admin/users?${params}`);
      return res.data.data;
    },
  });
}

export function useCreateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post('/admin/users', data);
      return res.data.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  });
}

export function useToggleUserStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await api.patch(`/admin/users/${id}/toggle-status`);
      return res.data.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  });
}

export function useRefData(category: string) {
  return useQuery({
    queryKey: ['refData', category],
    queryFn: async () => {
      const res = await api.get(`/ref-data/${category}`);
      return res.data.data;
    },
    staleTime: 60 * 60 * 1000,
  });
}
