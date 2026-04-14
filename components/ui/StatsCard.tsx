import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  color?: 'blue' | 'yellow' | 'green' | 'red' | 'purple' | 'gray';
  trend?: string;
}

const colorMap = {
  blue:   { bg: 'bg-blue-50',   icon: 'bg-blue-100 text-blue-600',   text: 'text-blue-600' },
  yellow: { bg: 'bg-yellow-50', icon: 'bg-yellow-100 text-yellow-600', text: 'text-yellow-600' },
  green:  { bg: 'bg-green-50',  icon: 'bg-green-100 text-green-600',  text: 'text-green-600' },
  red:    { bg: 'bg-red-50',    icon: 'bg-red-100 text-red-600',      text: 'text-red-600' },
  purple: { bg: 'bg-purple-50', icon: 'bg-purple-100 text-purple-600', text: 'text-purple-600' },
  gray:   { bg: 'bg-gray-50',   icon: 'bg-gray-100 text-gray-600',    text: 'text-gray-600' },
};

export function StatsCard({ title, value, icon: Icon, color = 'blue', trend }: StatsCardProps) {
  const c = colorMap[color];
  return (
    <div className={cn('rounded-2xl p-5 shadow-sm border border-gray-100', c.bg)}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className={cn('text-3xl font-bold mt-1', c.text)}>{value}</p>
          {trend && <p className="text-xs text-gray-400 mt-1">{trend}</p>}
        </div>
        <div className={cn('p-3 rounded-xl', c.icon)}>
          <Icon size={22} />
        </div>
      </div>
    </div>
  );
}
