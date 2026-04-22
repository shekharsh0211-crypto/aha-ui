'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useDashboard } from '@/hooks/useDashboard';
import { useBookings } from '@/hooks/useBookings';
import { BookingStatusBadge } from '@/components/ui/StatusBadge';
import { formatDate } from '@/lib/utils';

const DATE_TABS = ['All', 'Yesterday', 'Today', 'Tomorrow'];

function getDateRange(tab: string): { from: string; to: string } {
  const now = new Date();
  const startOfDay = (d: Date) => {
    const x = new Date(d); x.setHours(0, 0, 0, 0); return x;
  };
  const endOfDay = (d: Date) => {
    const x = new Date(d); x.setHours(23, 59, 59, 999); return x;
  };
  const toISO = (d: Date) => d.toISOString().slice(0, 19);

  if (tab === 'Yesterday') {
    const y = new Date(now); y.setDate(y.getDate() - 1);
    return { from: toISO(startOfDay(y)), to: toISO(endOfDay(y)) };
  }
  if (tab === 'Tomorrow') {
    const t = new Date(now); t.setDate(t.getDate() + 1);
    return { from: toISO(startOfDay(t)), to: toISO(endOfDay(t)) };
  }
  // Today
  return { from: toISO(startOfDay(now)), to: toISO(endOfDay(now)) };
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('All');
  const { data: summary, isLoading: summaryLoading } = useDashboard();
  const dateRange = activeTab !== 'All' ? getDateRange(activeTab) : undefined;
  const { data: bookingsPage, isLoading: bookingsLoading } = useBookings({
    size: 6,
    sortDir: 'desc',
    from: dateRange?.from,
    to: dateRange?.to,
  });

  const stats = [
    {
      value: summary?.confirmedBookings ?? 0,
      label: 'Active Bookings',
      sub: 'In progress',
      color: '#2563eb',
    },
    {
      value: summary?.pendingBookings ?? 0,
      label: 'Upcoming Trips',
      sub: 'Confirmed',
      color: '#f59e0b',
    },
    {
      value: summary?.completedBookings ?? 0,
      label: 'Completed',
      sub: 'All time',
      color: '#16a34a',
    },
    {
      value: summary?.cancelledBookings ?? 0,
      label: 'Cancelled',
      sub: 'This month',
      color: '#ef4444',
    },
  ];

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            {summaryLoading ? (
              <div className="h-8 w-14 bg-gray-200 rounded animate-pulse mb-2" />
            ) : (
              <p className="text-3xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
            )}
            <p className="text-sm font-medium text-gray-700 mt-1">{stat.label}</p>
            <p className="text-xs text-gray-400 mt-0.5">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Filter by date */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm text-gray-500 mr-1">Filter by date:</span>
        {DATE_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all border ${
              activeTab === tab
                ? 'bg-gray-800 text-white border-gray-800'
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* My Bookings table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900 text-sm">My Bookings</h2>
          <Link href="/bookings" className="text-xs text-blue-600 hover:underline font-medium">
            View All
          </Link>
        </div>

        <div className="overflow-x-auto">
          {bookingsLoading ? (
            <div className="p-5 space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-9 bg-gray-100 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : !bookingsPage?.content?.length ? (
            <div className="flex flex-col items-center py-10 text-gray-400">
              <p className="text-sm">No bookings yet</p>
              <Link href="/bookings/new" className="mt-2 text-sm text-blue-600 hover:underline">
                Book your first ride
              </Link>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-gray-500 bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-5 py-3 font-medium">Booking Ref</th>
                  <th className="text-left px-5 py-3 font-medium hidden sm:table-cell">Date &amp; Time</th>
                  <th className="text-left px-5 py-3 font-medium hidden md:table-cell">Pickup to Drop</th>
                  <th className="text-left px-5 py-3 font-medium hidden lg:table-cell">Vehicle</th>
                  <th className="text-left px-5 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {bookingsPage.content.map((b: any) => (
                  <tr key={b.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3">
                      <Link href={`/bookings/${b.id}`} className="text-blue-600 hover:underline font-mono text-xs font-medium">
                        {b.referenceNumber}
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-gray-500 text-xs hidden sm:table-cell whitespace-nowrap">
                      {formatDate(b.pickupDatetime)}
                    </td>
                    <td className="px-5 py-3 text-gray-600 hidden md:table-cell">
                      <span className="truncate max-w-[200px] block">
                        {b.pickupLocation} → {b.dropoffLocation}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-500 text-xs hidden lg:table-cell">
                      {b.vehicleDescription ?? '—'}
                    </td>
                    <td className="px-5 py-3">
                      <BookingStatusBadge status={b.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
