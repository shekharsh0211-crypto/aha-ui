'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin } from 'lucide-react';
import { useCreateBooking } from '@/hooks/useBookings';

const TRIP_TYPES = ['Old Station', 'Airport Transfer', 'Train Transfer', 'Hotel Transfer', 'City Tour'];
const VEHICLE_TYPES = ['Sedan', 'SUV', 'MUV/Ertiga', 'Luxury', 'Van'];

export default function NewBookingPage() {
  const router = useRouter();
  const createBooking = useCreateBooking();

  const [form, setForm] = useState({
    pickupLocation: '',
    dropoffLocation: '',
    pickupDate: '',
    pickupTime: '',
    tripType: '',
    vehicleType: '',
    passengerName: '',
    passengerPhone: '+91',
    passengerCount: 1,
    specialInstructions: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const set = (field: string, value: any) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => { const n = { ...e }; delete n[field]; return n; });
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.pickupLocation.trim()) e.pickupLocation = 'Required';
    if (!form.dropoffLocation.trim()) e.dropoffLocation = 'Required';
    if (!form.pickupDate) e.pickupDate = 'Required';
    if (!form.pickupTime) e.pickupTime = 'Required';
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitting(true);
    try {
      const pickupDatetime = `${form.pickupDate}T${form.pickupTime}`;
      const booking = await createBooking.mutateAsync({
        pickupLocation: form.pickupLocation,
        dropoffLocation: form.dropoffLocation,
        pickupDatetime,
        passengerCount: form.passengerCount,
        specialInstructions: form.specialInstructions || undefined,
        vehicleType: form.vehicleType || undefined,
        tripType: form.tripType || undefined,
      });
      router.push(`/bookings/${booking.id}`);
    } catch (err: any) {
      setErrors({ general: err?.response?.data?.message ?? 'Failed to create booking' });
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = (f: string) =>
    `w-full px-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 bg-white ${
      errors[f] ? 'border-red-400' : 'border-gray-300'
    }`;

  const chipCls = (active: boolean) =>
    `px-4 py-2 rounded-full text-sm font-medium border transition-all cursor-pointer ${
      active
        ? 'bg-blue-600 text-white border-blue-600'
        : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400 hover:text-blue-600'
    }`;

  const SectionLabel = ({ n, title }: { n: string; title: string }) => (
    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
      <span className="text-blue-600 mr-1">{n})</span>{title}
    </p>
  );

  return (
    <div className="max-w-2xl">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-base font-bold text-gray-900 mb-6">New Booking</h2>

        {errors.general && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 1) Trip Details */}
          <div>
            <SectionLabel n="1" title="Trip Details" />
            <div className="space-y-3">
              <div className="relative">
                <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Pickup Location"
                  value={form.pickupLocation}
                  onChange={(e) => set('pickupLocation', e.target.value)}
                  className={`${inputCls('pickupLocation')} pl-9`}
                />
                {errors.pickupLocation && <p className="mt-1 text-xs text-red-600">{errors.pickupLocation}</p>}
              </div>
              <div className="relative">
                <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Drop Location"
                  value={form.dropoffLocation}
                  onChange={(e) => set('dropoffLocation', e.target.value)}
                  className={`${inputCls('dropoffLocation')} pl-9`}
                />
                {errors.dropoffLocation && <p className="mt-1 text-xs text-red-600">{errors.dropoffLocation}</p>}
              </div>
            </div>
          </div>

          {/* 2) Date and Time + Trip Type */}
          <div>
            <SectionLabel n="2" title="Date and Time" />
            <div className="flex gap-3 mb-4">
              <div className="flex-1">
                <input
                  type="date"
                  value={form.pickupDate}
                  onChange={(e) => set('pickupDate', e.target.value)}
                  className={inputCls('pickupDate')}
                />
                {errors.pickupDate && <p className="mt-1 text-xs text-red-600">{errors.pickupDate}</p>}
              </div>
              <div className="flex-1">
                <input
                  type="time"
                  value={form.pickupTime}
                  onChange={(e) => set('pickupTime', e.target.value)}
                  className={inputCls('pickupTime')}
                />
                {errors.pickupTime && <p className="mt-1 text-xs text-red-600">{errors.pickupTime}</p>}
              </div>
            </div>

            {/* Trip Type chips inline */}
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              <span className="text-blue-600 mr-1">4)</span>Trip Type
            </p>
            <div className="flex flex-wrap gap-2">
              {TRIP_TYPES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => set('tripType', form.tripType === t ? '' : t)}
                  className={chipCls(form.tripType === t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* 3) Vehicle Type */}
          <div>
            <SectionLabel n="3" title="Vehicle Type" />
            <div className="flex flex-wrap gap-2">
              {VEHICLE_TYPES.map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => set('vehicleType', form.vehicleType === v ? '' : v)}
                  className={chipCls(form.vehicleType === v)}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* 4 & 5) Passenger */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <SectionLabel n="5" title="Passenger Name" />
              <input
                type="text"
                placeholder="Full name"
                value={form.passengerName}
                onChange={(e) => set('passengerName', e.target.value)}
                className={inputCls('passengerName')}
              />
            </div>
            <div>
              <SectionLabel n="6" title="Passenger Phone" />
              <input
                type="tel"
                placeholder="+91"
                value={form.passengerPhone}
                onChange={(e) => set('passengerPhone', e.target.value)}
                className={inputCls('passengerPhone')}
              />
            </div>
          </div>

          {/* 6) Special Instructions */}
          <div>
            <SectionLabel n="7" title="Special Instruction" />
            <textarea
              rows={3}
              placeholder="Any special requirements…"
              value={form.specialInstructions}
              onChange={(e) => set('specialInstructions', e.target.value)}
              className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 resize-none bg-white"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-teal-700 hover:bg-teal-800 text-white font-semibold text-sm rounded-lg transition-colors disabled:opacity-60"
          >
            {submitting ? 'Creating…' : 'Create / Send Request'}
          </button>
        </form>
      </div>
    </div>
  );
}
