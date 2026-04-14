import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, parseISO } from 'date-fns';
import { BookingStatus, TicketStatus } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateStr?: string): string {
  if (!dateStr) return '—';
  try {
    return format(parseISO(dateStr), 'dd MMM yyyy, HH:mm');
  } catch {
    return dateStr;
  }
}

export function formatDateShort(dateStr?: string): string {
  if (!dateStr) return '—';
  try {
    return format(parseISO(dateStr), 'dd MMM yyyy');
  } catch {
    return dateStr;
  }
}

export function formatCurrency(amount?: number, currency = 'USD'): string {
  if (amount === undefined || amount === null) return '—';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
}

export const bookingStatusConfig: Record<BookingStatus, { label: string; color: string; bg: string }> = {
  PENDING:     { label: 'Pending',     color: 'text-yellow-700', bg: 'bg-yellow-100' },
  CONFIRMED:   { label: 'Confirmed',   color: 'text-blue-700',   bg: 'bg-blue-100'   },
  IN_PROGRESS: { label: 'In Progress', color: 'text-purple-700', bg: 'bg-purple-100' },
  COMPLETED:   { label: 'Completed',   color: 'text-green-700',  bg: 'bg-green-100'  },
  CANCELLED:   { label: 'Cancelled',   color: 'text-red-700',    bg: 'bg-red-100'    },
  REBOOKED:    { label: 'Rebooked',    color: 'text-gray-700',   bg: 'bg-gray-100'   },
};

export const ticketStatusConfig: Record<TicketStatus, { label: string; color: string; bg: string }> = {
  OPEN:        { label: 'Open',        color: 'text-blue-700',   bg: 'bg-blue-100'   },
  IN_PROGRESS: { label: 'In Progress', color: 'text-yellow-700', bg: 'bg-yellow-100' },
  RESOLVED:    { label: 'Resolved',    color: 'text-green-700',  bg: 'bg-green-100'  },
  CLOSED:      { label: 'Closed',      color: 'text-gray-700',   bg: 'bg-gray-100'   },
};

export function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}
