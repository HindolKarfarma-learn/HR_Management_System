import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/Button';

export function Pagination({ page, totalPages, onPageChange, totalItems, pageSize }) {
  const start = totalItems ? (page - 1) * pageSize + 1 : 0;
  const end = Math.min(page * pageSize, totalItems);
  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-100 px-5 py-4 text-sm sm:flex-row">
      <p className="text-slate-500">Showing <strong className="text-slate-700">{start}–{end}</strong> of {totalItems}</p>
      <div className="flex items-center gap-2">
        <Button size="sm" variant="secondary" disabled={page <= 1} onClick={() => onPageChange(page - 1)} aria-label="Previous page">
          <ChevronLeft className="size-4" /> Previous
        </Button>
        <span className="px-2 text-slate-600">{page} / {Math.max(totalPages, 1)}</span>
        <Button size="sm" variant="secondary" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)} aria-label="Next page">
          Next <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
