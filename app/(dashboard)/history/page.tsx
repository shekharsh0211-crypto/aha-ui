'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useBookings } from '@/hooks/useBookings';
import { formatDate } from '@/lib/utils';
import { BookingStatusBadge } from '@/components/ui/StatusBadge';

export default function TripHistoryPage() {
  const [page, setPage] = useState(0);

  const { data, isLoading } = useBookings({
    status: 'COMPLETED',
    page,
    size: 10,
    sortDir: 'desc',
  });
  const bookings = data?.content ?? [];
  const totalPages = data?.totalPages ?? 0;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Trip History</h1>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-gray-400">
            <p className="text-sm font-medium">No completed trips yet</p>
            <Link href="/bookings/new" className="mt-2 text-sm hover:underline" style={{ color: '#2563eb' }}>
              Book a ride
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Booking Ref</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Date &amp; Time</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Pickup and Drop</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Vehicle</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b: any, idx: number) => (
                  <tr
                    key={b.id}
                    style={{ borderBottom: idx < bookings.length - 1 ? '1px solid #f3f4f6' : 'none' }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <Link
                        href={`/bookings/${b.id}`}
                        className="font-semibold text-gray-800 hover:underline text-xs"
                        style={{ fontFamily: 'monospace' }}
                      >
                        {b.referenceNumber}
                      </Link>
                    </td>
                    <td className="px-5 py-4 text-gray-500 text-xs hidden sm:table-cell whitespace-nowrap">
                      {formatDate(b.pickupDatetime)}
                    </td>
                    <td className="px-5 py-4 text-gray-600 hidden md:table-cell">
                      <span className="block truncate max-w-xs">
                        {b.pickupLocation} → {b.dropoffLocation}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-500 text-xs hidden lg:table-cell">
                      {b.vehicleDescription ?? '—'}
                    </td>
                    <td className="px-5 py-4">
                      <BookingStatusBadge status={b.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 bg-gray-50">
            <p className="text-xs text-gray-500">Page {page + 1} of {totalPages}</p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 bg-white disabled:opacity-40 hover:bg-gray-50 text-gray-600"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 bg-white disabled:opacity-40 hover:bg-gray-50 text-gray-600"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
