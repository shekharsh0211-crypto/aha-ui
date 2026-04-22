'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);

  // Restore remembered email on mount
  useEffect(() => {
    const saved = localStorage.getItem('rememberedEmail');
    if (saved) { setEmail(saved); setRemember(true); }
  }, []);
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password, remember);
      if (remember) {
        localStorage.setItem('rememberedEmail', email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }
      router.push('/dashboard');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left — scenic photo */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=1400&q=85')`,
          }}
        />
      </div>

      {/* Right — login form */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="bg-white rounded-2xl shadow-lg px-8 py-10">
            {/* Logo */}
            <div className="flex flex-col items-center mb-8">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: '#f59e0b' }}>
                <svg width="30" height="30" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Cab body */}
                  <path d="M6 20V14L10 8H22L26 14V20H6Z" fill="white"/>
                  {/* Roof / cabin */}
                  <path d="M11 8L13 4H19L21 8H11Z" fill="white" opacity="0.8"/>
                  {/* Windows */}
                  <path d="M12 8L13.5 5H18.5L20 8H12Z" fill="#f59e0b"/>
                  {/* Checker stripe */}
                  <rect x="6" y="15" width="3" height="2" fill="#1e293b"/>
                  <rect x="12" y="15" width="3" height="2" fill="#1e293b"/>
                  <rect x="18" y="15" width="3" height="2" fill="#1e293b"/>
                  {/* Wheels */}
                  <circle cx="11" cy="20" r="3" fill="#1e293b"/>
                  <circle cx="11" cy="20" r="1.5" fill="#94a3b8"/>
                  <circle cx="21" cy="20" r="3" fill="#1e293b"/>
                  <circle cx="21" cy="20" r="1.5" fill="#94a3b8"/>
                  {/* Door handle */}
                  <rect x="15" y="12" width="4" height="1" rx="0.5" fill="#f59e0b"/>
                  {/* Ground line */}
                  <line x1="4" y1="23" x2="28" y2="23" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">EbixCabs</h1>
              <p className="text-sm text-gray-500 mt-1">Sign in to your account</p>
            </div>

            {error && (
              <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3" autoComplete="off">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-full bg-gray-100 border border-gray-200 focus:outline-none focus:border-teal-500 focus:bg-white text-sm transition-all placeholder-gray-400"
              />

              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPwd ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-full bg-gray-100 border border-gray-200 focus:outline-none focus:border-teal-500 focus:bg-white text-sm transition-all placeholder-gray-400 pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(p => !p)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              <label className="flex items-center gap-2.5 cursor-pointer select-none pt-1">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={e => setRemember(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 accent-teal-600"
                />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-full bg-teal-700 hover:bg-teal-800 text-white font-semibold text-sm tracking-wide transition-all disabled:opacity-60 mt-2"
              >
                {loading ? 'Signing in…' : 'Sign In'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
