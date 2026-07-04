import { Search, X } from 'lucide-react';

export function SearchBar({ value, onChange, placeholder = 'Search…', className = '' }) {
  return (
    <div className={`relative ${className}`}>
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-9 text-sm"
      />
      {value && (
        <button type="button" onClick={() => onChange('')} aria-label="Clear search" className="absolute right-1 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-md text-slate-400 hover:bg-slate-100">
          <X className="size-4" />
        </button>
      )}
    </div>
  );
}
