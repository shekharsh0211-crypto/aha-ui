'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, CalendarCheck, Car,
  MessageSquare, History, LogOut, Users
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

const navItems = [
  { href: '/dashboard',    icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/bookings',     icon: CalendarCheck,   label: 'My Bookings' },
  { href: '/bookings/new', icon: Car,             label: 'Book a Ride' },
  { href: '/feedback',     icon: MessageSquare,   label: 'Support' },
  { href: '/history',      icon: History,         label: 'Trip History' },
];

const adminItems = [
  { href: '/admin/users', icon: Users, label: 'Users' },
];

interface SidebarProps {
  onClose?: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const isAdmin = user?.role === 'ROLE_ADMIN';

  const handleLogout = async () => {
    await logout();
    window.location.href = '/login';
  };

  const isActive = (href: string) => {
    if (href === '/bookings/new') return pathname === '/bookings/new';
    if (href === '/bookings') return pathname.startsWith('/bookings') && pathname !== '/bookings/new';
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <div className="flex flex-col h-full w-56" style={{ backgroundColor: '#1a2332' }}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
        <div className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#f59e0b' }}>
          <Car size={14} className="text-white" />
        </div>
        <p className="font-bold text-white text-sm">AHA Travel</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 overflow-y-auto space-y-0.5">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all',
                active
                  ? 'text-white font-medium'
                  : 'font-normal hover:bg-white/5'
              )}
              style={
                active
                  ? { backgroundColor: '#2563eb' }
                  : { color: '#8a9bbf' }
              }
            >
              <Icon size={15} style={active ? { color: 'white' } : { color: '#8a9bbf' }} />
              <span>{label}</span>
            </Link>
          );
        })}

        {isAdmin && (
          <>
            <div className="my-2 mx-1 border-t" style={{ borderColor: 'rgba(255,255,255,0.07)' }} />
            {adminItems.map(({ href, icon: Icon, label }) => {
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={onClose}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all',
                    active ? 'text-white font-medium' : 'font-normal hover:bg-white/5'
                  )}
                  style={active ? { backgroundColor: '#2563eb' } : { color: '#8a9bbf' }}
                >
                  <Icon size={15} style={active ? { color: 'white' } : { color: '#8a9bbf' }} />
                  <span>{label}</span>
                </Link>
              );
            })}
          </>
        )}
      </nav>

      {/* Logout */}
      <div className="px-3 py-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm transition-all hover:bg-white/5"
          style={{ color: '#8a9bbf' }}
        >
          <LogOut size={15} style={{ color: '#8a9bbf' }} />
          <span>+ Logout</span>
        </button>
      </div>
    </div>
  );
}
