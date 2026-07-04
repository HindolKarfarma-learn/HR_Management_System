import { useEffect, useRef, useState } from 'react';

export function Dropdown({ trigger, children, align = 'right' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (event) => !ref.current?.contains(event.target) && setOpen(false);
    document.addEventListener('pointerdown', handleClick);
    return () => document.removeEventListener('pointerdown', handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <div onClick={() => setOpen((value) => !value)}>{trigger}</div>
      {open && (
        <div className={`absolute top-full z-30 mt-2 min-w-48 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg ${align === 'right' ? 'right-0' : 'left-0'}`} onClick={() => setOpen(false)}>
          {children}
        </div>
      )}
    </div>
  );
}

export function DropdownItem({ children, icon: Icon, onClick, danger = false }) {
  return (
    <button type="button" onClick={onClick} className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition hover:bg-slate-50 ${danger ? 'text-red-600' : 'text-slate-700'}`}>
      {Icon && <Icon className="size-4" />}
      {children}
    </button>
  );
}
