'use client';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, MapPin, Calendar, Users, FileText,
  Clock, AlertCircle, RefreshCw, XCircle, User, Phone
} from 'lucide-react';
import { useBooking, useCancelBooking, useRebookBooking } from '@/hooks/useBookings';
import { BookingStatusBadge } from '@/components/ui/StatusBadge';
import { formatDate, formatCurrency } from '@/lib/utils';
import { StatusHistory } from '@/types';

export default function BookingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: booking, isLoading } = useBooking(Number(id));
  const cancelBooking = useCancelBooking();
  const rebookBooking = useRebookBooking();

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  const handleCancel = async () => {
    if (!cancelReason.trim()) return;
    await cancelBooking.mutateAsync({ id: Number(id), reason: cancelReason });
    setShowCancelModal(false);
    setCancelReason('');
  };

  const handleRebook = async () => {
    if (!booking) return;
    const newBooking = await rebookBooking.mutateAsync({
      id: Number(id),
      data: {
        pickupLocation: booking.pickupLocation,
        dropoffLocation: booking.dropoffLocation,
        pickupDatetime: new Date(Date.now() + 3600000).toISOString().slice(0, 16),
        passengerCount: booking.passengerCount,
      },
    });
    router.push(`/bookings/${newBooking.id}`);
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="h-8 w-48 bg-gray-200 rounded-lg animate-pulse" />
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-40 bg-gray-100 rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <AlertCircle size={48} className="mx-auto text-gray-300 mb-3" />
        <p className="text-gray-500">Booking not found</p>
        <Link href="/bookings" className="mt-4 inline-block text-sm text-blue-600 hover:underline">
          Back to bookings
        </Link>
      </div>
    );
  }

  const canCancel = ['PENDING', 'CONFIRMED'].includes(booking.status);
  const canRebook = ['CANCELLED', 'COMPLETED'].includes(booking.status);

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
          <ArrowLeft size={18} className="text-gray-500" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-xl font-bold text-gray-900 font-mono">{booking.referenceNumber}</h1>
            <BookingStatusBadge status={booking.status} />
          </div>
          <p className="text-xs text-gray-500 mt-0.5">Created {formatDate(booking.createdAt)}</p>
        </div>
      </div>

      {/* Trip Info */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h2 className="font-semibold text-gray-900 text-sm">Trip Details</h2>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0 mt-0.5">
              <MapPin size={14} className="text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Pickup</p>
              <p className="text-sm font-medium text-gray-900">{booking.pickupLocation}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0 mt-0.5">
              <MapPin size={14} className="text-red-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Drop-off</p>
              <p className="text-sm font-medium text-gray-900">{booking.dropoffLocation}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Calendar size={14} className="text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Pickup Time</p>
              <p className="text-sm font-medium text-gray-900">{formatDate(booking.pickupDatetime)}</p>
            </div>
          </div>
          {booking.passengerCount && (
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Users size={14} className="text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Passengers</p>
                <p className="text-sm font-medium text-gray-900">{booking.passengerCount}</p>
              </div>
            </div>
          )}
          {booking.passengerName && (
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                <User size={14} className="text-indigo-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Passenger Name</p>
                <p className="text-sm font-medium text-gray-900">{booking.passengerName}</p>
              </div>
            </div>
          )}
          {booking.passengerPhone && (
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-teal-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Phone size={14} className="text-teal-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Passenger Phone</p>
                <p className="text-sm font-medium text-gray-900">{booking.passengerPhone}</p>
              </div>
            </div>
          )}
          {booking.totalAmount && (
            <div className="pt-2 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Total Amount</span>
                <span className="text-base font-bold text-gray-900">{formatCurrency(booking.totalAmount, booking.currency)}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Vehicle */}
      {booking.vehiclePlate && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 text-sm mb-3">Assigned Vehicle</h2>
          <p className="text-sm text-gray-700">
            <span className="font-mono font-medium">{booking.vehiclePlate}</span>
            {booking.vehicleDescription && <span className="text-gray-500"> — {booking.vehicleDescription}</span>}
          </p>
        </div>
      )}

      {/* Special Instructions */}
      {booking.specialInstructions && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-3">
            <FileText size={15} className="text-gray-400" />
            <h2 className="font-semibold text-gray-900 text-sm">Special Instructions</h2>
          </div>
          <p className="text-sm text-gray-600">{booking.specialInstructions}</p>
        </div>
      )}

      {/* Cancellation reason */}
      {booking.cancellationReason && (
        <div className="bg-red-50 rounded-2xl border border-red-100 p-5">
          <div className="flex items-center gap-2 mb-2">
            <XCircle size={15} className="text-red-500" />
            <h2 className="font-semibold text-red-700 text-sm">Cancellation Reason</h2>
          </div>
          <p className="text-sm text-red-600">{booking.cancellationReason}</p>
        </div>
      )}

      {/* Status History */}
      {booking.statusHistory && booking.statusHistory.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock size={15} className="text-gray-400" />
            <h2 className="font-semibold text-gray-900 text-sm">Status History</h2>
          </div>
          <div className="space-y-3">
            {booking.statusHistory.map((h: StatusHistory) => (
              <div key={h.id} className="flex items-start gap-3 text-sm">
                <div className="w-2 h-2 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    {h.fromStatus && (
                      <span className="text-gray-500">{h.fromStatus}</span>
                    )}
                    {h.fromStatus && <span className="text-gray-400">→</span>}
                    <span className="font-medium text-gray-900">{h.toStatus}</span>
                    {h.changedBy && <span className="text-xs text-gray-400">by {h.changedBy}</span>}
                  </div>
                  {h.remarks && <p className="text-xs text-gray-500 mt-0.5">{h.remarks}</p>}
                  <p className="text-xs text-gray-400 mt-0.5">{formatDate(h.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      {(canCancel || canRebook) && (
        <div className="flex gap-3">
          {canRebook && (
            <button
              onClick={handleRebook}
              disabled={rebookBooking.isPending}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
            >
              <RefreshCw size={15} />
              {rebookBooking.isPending ? 'Rebooking…' : 'Rebook'}
            </button>
          )}
          {canCancel && (
            <button
              onClick={() => setShowCancelModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
            >
              <XCircle size={15} />
              Cancel Booking
            </button>
          )}
        </div>
      )}

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
            <h3 className="font-semibold text-gray-900 mb-1">Cancel Booking</h3>
            <p className="text-sm text-gray-500 mb-4">Please provide a reason for cancellation.</p>
            <textarea
              rows={3}
              placeholder="Reason for cancellation…"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 resize-none mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
              >
                Keep Booking
              </button>
              <button
                onClick={handleCancel}
                disabled={!cancelReason.trim() || cancelBooking.isPending}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 rounded-xl transition-colors"
              >
                {cancelBooking.isPending ? 'Cancelling…' : 'Cancel Booking'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
