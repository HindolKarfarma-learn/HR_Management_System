import { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '../../utils/cn';

export const Input = forwardRef(function Input(
  { label, error, hint, icon: Icon, className, id, type = 'text', ...props },
  ref,
) {
  const inputId = id || props.name;
  const [visible, setVisible] = useState(false);
  const isPassword = type === 'password';

  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-slate-700" htmlFor={inputId}>
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
        )}
        <input
          ref={ref}
          id={inputId}
          type={isPassword && visible ? 'text' : type}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          className={cn(
            'h-11 w-full rounded-lg border bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400',
            'transition hover:border-slate-300 disabled:cursor-not-allowed disabled:bg-slate-100',
            Icon && 'pl-10',
            isPassword && 'pr-10',
            error ? 'border-red-400' : 'border-slate-200',
            className,
          )}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setVisible((value) => !value)}
            className="absolute right-1 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-md text-slate-400 hover:text-slate-700"
            aria-label={visible ? 'Hide password' : 'Show password'}
          >
            {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        )}
      </div>
      {error && <p id={`${inputId}-error`} className="text-xs text-red-600">{error}</p>}
      {!error && hint && <p id={`${inputId}-hint`} className="text-xs text-slate-500">{hint}</p>}
    </div>
  );
});
