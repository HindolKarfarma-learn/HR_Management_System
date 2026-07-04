import { forwardRef } from 'react';
import { cn } from '../../utils/cn';

export const Select = forwardRef(function Select(
  { label, error, options = [], placeholder = 'Select an option', id, className, ...props },
  ref,
) {
  const selectId = id || props.name;
  return (
    <div className="space-y-1.5">
      {label && <label htmlFor={selectId} className="block text-sm font-medium text-slate-700">{label}</label>}
      <select
        ref={ref}
        id={selectId}
        aria-invalid={Boolean(error)}
        className={cn(
          'h-11 w-full rounded-lg border bg-white px-3 text-sm text-slate-900',
          error ? 'border-red-400' : 'border-slate-200',
          className,
        )}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
});
