import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { TicketStatus } from '@/types';

export function useFeedbacks(status?: TicketStatus, page = 0, size = 10) {
  return useQuery({
    queryKey: ['feedbacks', status, page, size],
    queryFn: async () => {
      const params = new URLSearchParams({ page: String(page), size: String(size) });
      if (status) params.set('status', status);
      const res = await api.get(`/feedback?${params}`);
      return res.data.data;
    },
  });
}

export function useFeedback(id: number | null) {
  return useQuery({
    queryKey: ['feedback', id],
    queryFn: async () => {
      const res = await api.get(`/feedback/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
}

export function useCreateFeedback() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post('/feedback', data);
      return res.data.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['feedbacks'] }),
  });
}

export function useReplyFeedback() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, message }: { id: number; message: string }) => {
      const res = await api.post(`/feedback/${id}/reply`, { message });
      return res.data.data;
    },
    onSuccess: (_, { id }) => qc.invalidateQueries({ queryKey: ['feedback', id] }),
  });
}

export function useCloseFeedback() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await api.patch(`/feedback/${id}/close`);
      return res.data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['feedbacks'] });
      qc.invalidateQueries({ queryKey: ['feedback'] });
    },
  });
}
