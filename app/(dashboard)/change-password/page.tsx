'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { KeyRound, Eye, EyeOff, CheckCircle } from 'lucide-react';
import api from '@/lib/api';

export default function ChangePasswordPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  const set = (field: string, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => { const n = { ...e }; delete n[field]; delete n.general; return n; });
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.currentPassword) e.currentPassword = 'Current password is required';
    if (!form.newPassword) {
      e.newPassword = 'New password is required';
    } else if (form.newPassword.length < 8) {
      e.newPassword = 'Password must be at least 8 characters';
    } else if (!/[A-Z]/.test(form.newPassword)) {
      e.newPassword = 'Must contain at least one uppercase letter';
    } else if (!/[0-9]/.test(form.newPassword)) {
      e.newPassword = 'Must contain at least one number';
    }
    if (!form.confirmPassword) {
      e.confirmPassword = 'Please confirm your new password';
    } else if (form.newPassword !== form.confirmPassword) {
      e.confirmPassword = 'Passwords do not match';
    }
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    try {
      await api.put('/users/me/password', {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      setSuccess(true);
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => router.push('/dashboard'), 2000);
    } catch (err: any) {
      setErrors({ general: err?.response?.data?.message ?? 'Failed to change password. Check your current password.' });
    } finally {
      setSaving(false);
    }
  };

  const inputCls = (field: string) =>
    `flex-1 px-4 py-3 text-sm focus:outline-none bg-transparent ${errors[field] ? 'placeholder-red-300' : 'placeholder-gray-400'}`;

  const wrapCls = (field: string) =>
    `flex items-center border rounded-xl overflow-hidden transition-colors ${
      errors[field] ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50 focus-within:border-blue-400 focus-within:bg-white'
    }`;

  const PasswordField = ({
    field, label, show, onToggle,
  }: { field: keyof typeof form; label: string; show: boolean; onToggle: () => void }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <div className={wrapCls(field)}>
        <input
          type={show ? 'text' : 'password'}
          autoComplete="new-password"
          value={form[field]}
          onChange={(e) => set(field, e.target.value)}
          placeholder={label}
          className={inputCls(field)}
        />
        <button type="button" onClick={onToggle} className="px-3 text-gray-400 hover:text-gray-600">
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      {errors[field] && <p className="mt-1 text-xs text-red-500">{errors[field]}</p>}
    </div>
  );

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
            <KeyRound size={18} className="text-blue-600" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Change Password</h1>
            <p className="text-xs text-gray-500">Update your account password</p>
          </div>
        </div>

        {success && (
          <div className="mb-5 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
            <CheckCircle size={18} className="text-green-600 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-green-800">Password changed successfully!</p>
              <p className="text-xs text-green-600">Redirecting to dashboard…</p>
            </div>
          </div>
        )}

        {errors.general && (
          <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
          <PasswordField
            field="currentPassword"
            label="Current Password"
            show={showCurrent}
            onToggle={() => setShowCurrent((v) => !v)}
          />
          <PasswordField
            field="newPassword"
            label="New Password"
            show={showNew}
            onToggle={() => setShowNew((v) => !v)}
          />

          {/* Password strength hint */}
          <p className="text-xs text-gray-400 -mt-2">
            Min 8 characters, one uppercase letter, one number
          </p>

          <PasswordField
            field="confirmPassword"
            label="Confirm New Password"
            show={showConfirm}
            onToggle={() => setShowConfirm((v) => !v)}
          />

          <button
            type="submit"
            disabled={saving || success}
            className="w-full py-3 mt-2 text-sm font-semibold text-white rounded-xl transition-colors disabled:opacity-60"
            style={{ backgroundColor: '#2563eb' }}
          >
            {saving ? 'Updating…' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
