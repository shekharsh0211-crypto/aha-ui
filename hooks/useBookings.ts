import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { BookingFilter } from '@/types';

export function useBookings(filter: BookingFilter = {}) {
  return useQuery({
    queryKey: ['bookings', filter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filter.status) params.set('status', filter.status);
      if (filter.from) params.set('from', filter.from);
      if (filter.to) params.set('to', filter.to);
      params.set('page', String(filter.page ?? 0));
      params.set('size', String(filter.size ?? 10));
      params.set('sortBy', filter.sortBy ?? 'createdAt');
      params.set('sortDir', filter.sortDir ?? 'desc');
      const res = await api.get(`/bookings?${params}`);
      return res.data.data;
    },
  });
}

export function useBooking(id: number | null) {
  return useQuery({
    queryKey: ['booking', id],
    queryFn: async () => {
      const res = await api.get(`/bookings/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
}

export function useCreateBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post('/bookings', data);
      return res.data.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['bookings'] }),
  });
}

export function useCancelBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, reason }: { id: number; reason: string }) => {
      const res = await api.post(`/bookings/${id}/cancel?reason=${encodeURIComponent(reason)}`);
      return res.data.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['bookings'] }),
  });
}

export function useRebookBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const res = await api.post(`/bookings/${id}/rebook`, data);
      return res.data.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['bookings'] }),
  });
}
