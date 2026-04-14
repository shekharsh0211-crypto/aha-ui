import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaginationProps {
  page: number;
  totalPages: number;
  totalElements: number;
  size: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, totalPages, totalElements, size, onPageChange }: PaginationProps) {
  const start = page * size + 1;
  const end = Math.min((page + 1) * size, totalElements);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-1 py-3">
      <p className="text-sm text-gray-500">
        Showing <span className="font-medium">{start}–{end}</span> of <span className="font-medium">{totalElements}</span> results
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 0}
          className="p-2 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors"
        >
          <ChevronLeft size={16} />
        </button>
        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
          const p = totalPages <= 5 ? i : Math.max(0, Math.min(page - 2, totalPages - 5)) + i;
          return (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={cn(
                'w-9 h-9 rounded-lg text-sm font-medium transition-colors',
                p === page ? 'bg-blue-600 text-white' : 'border border-gray-200 hover:bg-gray-50 text-gray-700'
              )}
            >
              {p + 1}
            </button>
          );
        })}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages - 1}
          className="p-2 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
