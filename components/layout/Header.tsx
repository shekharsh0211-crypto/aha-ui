'use client';
import { Menu, Bell } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getInitials } from '@/lib/utils';
import { usePathname } from 'next/navigation';

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/feedback': 'Support',
  '/profile': 'Profile',
  '/admin/users': 'User Management',
};

function getTitle(pathname: string) {
  if (pathname === '/bookings/new') return 'Book a Ride';
  if (pathname.startsWith('/bookings/') && pathname !== '/bookings/new') return 'Booking Details';
  if (pathname.startsWith('/bookings')) return 'My Bookings';
  return PAGE_TITLES[pathname] ?? 'Dashboard';
}

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user } = useAuth();
  const pathname = usePathname();
  const title = getTitle(pathname);

  return (
    <header className="bg-white border-b border-gray-200 px-5 py-0 flex items-center justify-between sticky top-0 z-30 h-14">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="p-1.5 rounded-lg hover:bg-gray-100 lg:hidden text-gray-500"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-base font-bold text-gray-900">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
          <Bell size={18} />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white">
            {getInitials(user?.fullName ?? 'U')}
          </div>
          <span className="text-sm font-medium text-gray-700 hidden sm:block">
            {user?.firstName} {user?.lastName?.[0]}.
          </span>
        </div>
      </div>
    </header>
  );
}
