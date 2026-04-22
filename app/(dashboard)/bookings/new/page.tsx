'use client';
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin } from 'lucide-react';
import { useCreateBooking } from '@/hooks/useBookings';

const TRIP_TYPES = ['Out Station', 'City Tour', 'Airport Transfer', 'Train Station Transfer'];
const VEHICLE_TYPES = ['Sedan', 'Innova Crysta', 'MUV/Ertiga', 'Luxury'];

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
    passengerPhone: '',
    passengerCount: 1,
    specialInstructions: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  // Today's date string (YYYY-MM-DD) — used as min for date input
  const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), []);

  // Min time: if selected date is today, restrict to current time (rounded up to next minute)
  const minTime = useMemo(() => {
    if (form.pickupDate !== todayStr) return undefined;
    const now = new Date();
    now.setMinutes(now.getMinutes() + 1);
    return now.toTimeString().slice(0, 5); // HH:MM
  }, [form.pickupDate, todayStr]);

  const set = (field: string, value: any) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => { const n = { ...e }; delete n[field]; return n; });
  };

  const handlePhoneChange = (val: string) => {
    // Strip +91 prefix if user types it, then allow digits only, max 10
    const stripped = val.replace(/^\+91/, '').replace(/\D/g, '').slice(0, 10);
    set('passengerPhone', stripped);
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.pickupLocation.trim())  e.pickupLocation  = 'Pickup location is required';
    if (!form.dropoffLocation.trim()) e.dropoffLocation = 'Drop location is required';
    if (!form.pickupDate) {
      e.pickupDate = 'Date is required';
    } else if (form.pickupDate < todayStr) {
      e.pickupDate = 'Date cannot be in the past';
    }
    if (!form.pickupTime) {
      e.pickupTime = 'Time is required';
    } else if (form.pickupDate && form.pickupTime) {
      const selected = new Date(`${form.pickupDate}T${form.pickupTime}`);
      if (selected <= new Date()) {
        e.pickupTime = 'Time cannot be in the past';
      }
    }
    if (!form.tripType)               e.tripType        = 'Please select a trip type';
    if (!form.vehicleType)            e.vehicleType     = 'Please select a cab category';
    if (!form.passengerName.trim())   e.passengerName   = 'Passenger name is required';
    if (!form.passengerPhone) {
      e.passengerPhone = 'Phone number is required';
    } else if (form.passengerPhone.length !== 10) {
      e.passengerPhone = 'Phone number must be 10 digits';
    }
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
        passengerName: form.passengerName || undefined,
        passengerPhone: form.passengerPhone ? `+91${form.passengerPhone}` : undefined,
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
    `w-full px-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 bg-white transition-colors ${
      errors[f]
        ? 'border-red-400 focus:ring-red-500/20 focus:border-red-400 bg-red-50'
        : 'border-gray-300 focus:ring-blue-500/20 focus:border-blue-400'
    }`;

  const chipGroupCls = (hasError: boolean) =>
    hasError ? 'p-2 rounded-lg border border-red-400 bg-red-50' : '';

  const chipCls = (active: boolean) =>
    `px-4 py-2 rounded-full text-sm font-medium border transition-all cursor-pointer ${
      active
        ? 'bg-blue-600 text-white border-blue-600'
        : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400 hover:text-blue-600'
    }`;

  const Label = ({ text, required }: { text: string; required?: boolean }) => (
    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
      {text}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </p>
  );

  const SectionLabel = ({ n, title, required }: { n: string; title: string; required?: boolean }) => (
    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
      <span className="text-blue-600 mr-1">{n})</span>
      {title}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </p>
  );

  return (
    <div className="max-w-2xl">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-base font-bold text-gray-900 mb-1">New Booking</h2>
        <p className="text-xs text-gray-400 mb-6">Fields marked with <span className="text-red-500 font-bold">*</span> are mandatory</p>

        {errors.general && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 1) Trip Details */}
          <div>
            <SectionLabel n="1" title="Trip Details" required />
            <div className="space-y-3">
              <div className="relative">
                <MapPin size={15} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${errors.pickupLocation ? 'text-red-400' : 'text-gray-400'}`} />
                <input
                  type="text"
                  placeholder="Pickup Location *"
                  value={form.pickupLocation}
                  onChange={(e) => set('pickupLocation', e.target.value)}
                  className={`${inputCls('pickupLocation')} pl-9`}
                />
                {errors.pickupLocation && <p className="mt-1 text-xs text-red-500">{errors.pickupLocation}</p>}
              </div>
              <div className="relative">
                <MapPin size={15} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${errors.dropoffLocation ? 'text-red-400' : 'text-gray-400'}`} />
                <input
                  type="text"
                  placeholder="Drop Location *"
                  value={form.dropoffLocation}
                  onChange={(e) => set('dropoffLocation', e.target.value)}
                  className={`${inputCls('dropoffLocation')} pl-9`}
                />
                {errors.dropoffLocation && <p className="mt-1 text-xs text-red-500">{errors.dropoffLocation}</p>}
              </div>
            </div>
          </div>

          {/* 2) Date and Time */}
          <div>
            <SectionLabel n="2" title="Date and Time" required />
            <div className="flex gap-3">
              <div className="flex-1">
                <input
                  type="date"
                  value={form.pickupDate}
                  min={todayStr}
                  onChange={(e) => {
                    // Clear time if switching to today and existing time is in the past
                    const newDate = e.target.value;
                    setForm((f) => {
                      if (newDate === todayStr && f.pickupTime) {
                        const selected = new Date(`${newDate}T${f.pickupTime}`);
                        if (selected <= new Date()) return { ...f, pickupDate: newDate, pickupTime: '' };
                      }
                      return { ...f, pickupDate: newDate };
                    });
                    setErrors((err) => { const n = { ...err }; delete n.pickupDate; delete n.pickupTime; return n; });
                  }}
                  className={inputCls('pickupDate')}
                />
                {errors.pickupDate && <p className="mt-1 text-xs text-red-500">{errors.pickupDate}</p>}
              </div>
              <div className="flex-1">
                <input
                  type="time"
                  value={form.pickupTime}
                  min={minTime}
                  onChange={(e) => set('pickupTime', e.target.value)}
                  className={inputCls('pickupTime')}
                />
                {errors.pickupTime && <p className="mt-1 text-xs text-red-500">{errors.pickupTime}</p>}
              </div>
            </div>
          </div>

          {/* 3) Trip Type */}
          <div>
            <SectionLabel n="3" title="Trip Type" required />
            <div className={`flex flex-wrap gap-2 ${chipGroupCls(!!errors.tripType)}`}>
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
            {errors.tripType && <p className="mt-1 text-xs text-red-500">{errors.tripType}</p>}
          </div>

          {/* 4) Cab Category */}
          <div>
            <SectionLabel n="4" title="Cab Category" required />
            <div className={`flex flex-wrap gap-2 ${chipGroupCls(!!errors.vehicleType)}`}>
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
            {errors.vehicleType && <p className="mt-1 text-xs text-red-500">{errors.vehicleType}</p>}
          </div>

          {/* 5) Passenger Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label text="Passenger Name" required />
              <input
                type="text"
                placeholder="Full name"
                value={form.passengerName}
                onChange={(e) => set('passengerName', e.target.value)}
                className={inputCls('passengerName')}
              />
              {errors.passengerName && <p className="mt-1 text-xs text-red-500">{errors.passengerName}</p>}
            </div>
            <div>
              <Label text="Passenger Phone" required />
              <div className={`flex items-center border rounded-lg overflow-hidden bg-white transition-colors ${errors.passengerPhone ? 'border-red-400 bg-red-50' : 'border-gray-300 focus-within:border-blue-400'}`}>
                <span className="px-3 py-2.5 text-sm font-medium text-gray-500 bg-gray-50 border-r border-gray-300 select-none whitespace-nowrap">+91</span>
                <input
                  type="tel"
                  placeholder="10-digit number"
                  value={form.passengerPhone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  maxLength={10}
                  inputMode="numeric"
                  className="flex-1 px-3 py-2.5 text-sm focus:outline-none bg-transparent"
                />
              </div>
              {errors.passengerPhone
                ? <p className="mt-1 text-xs text-red-500">{errors.passengerPhone}</p>
                : <p className="mt-1 text-xs text-gray-400">{form.passengerPhone.length}/10 digits</p>
              }
            </div>
          </div>

          {/* 6) Special Instructions */}
          <div>
            <Label text="Special Instructions" />
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
