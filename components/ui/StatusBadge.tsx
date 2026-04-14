import { BookingStatus, TicketStatus } from '@/types';

// Colors matched exactly to screenshots
const bookingBadge: Record<BookingStatus, { label: string; bg: string; color: string }> = {
  PENDING:     { label: 'Pending',     bg: '#fff3cd', color: '#92680a' },
  CONFIRMED:   { label: 'Active',      bg: '#d1fae5', color: '#065f46' },
  IN_PROGRESS: { label: 'In Progress', bg: '#dbeafe', color: '#1e40af' },
  COMPLETED:   { label: 'Completed',   bg: '#2563eb', color: '#ffffff' },
  CANCELLED:   { label: 'Cancelled',   bg: '#fee2e2', color: '#b91c1c' },
  REBOOKED:    { label: 'Rebooked',    bg: '#f3f4f6', color: '#374151' },
};

const ticketBadge: Record<TicketStatus, { label: string; bg: string; color: string }> = {
  OPEN:        { label: 'Open',        bg: '#dbeafe', color: '#1e40af' },
  IN_PROGRESS: { label: 'In Progress', bg: '#fff3cd', color: '#92680a' },
  RESOLVED:    { label: 'Resolved',    bg: '#d1fae5', color: '#065f46' },
  CLOSED:      { label: 'Closed',      bg: '#f3f4f6', color: '#374151' },
};

export function BookingStatusBadge({ status }: { status: BookingStatus }) {
  const cfg = bookingBadge[status] ?? { label: status, bg: '#f3f4f6', color: '#374151' };
  return (
    <span
      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold"
      style={{ backgroundColor: cfg.bg, color: cfg.color }}
    >
      {cfg.label}
    </span>
  );
}

export function TicketStatusBadge({ status }: { status: TicketStatus }) {
  const cfg = ticketBadge[status] ?? { label: status, bg: '#f3f4f6', color: '#374151' };
  return (
    <span
      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold"
      style={{ backgroundColor: cfg.bg, color: cfg.color }}
    >
      {cfg.label}
    </span>
  );
}
