import { ChevronRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export function Breadcrumb() {
  const { pathname } = useLocation();
  const parts = pathname.split('/').filter(Boolean);
  return (
    <nav aria-label="Breadcrumb" className="mb-2 flex items-center gap-1 text-xs text-slate-500">
      <Link to="/dashboard" className="hover:text-brand-600">Home</Link>
      {parts.filter((part) => part !== 'dashboard').map((part, index, values) => {
        const path = `/${parts.slice(0, parts.indexOf(part) + 1).join('/')}`;
        const label = part.replaceAll('-', ' ');
        return (
          <span key={path} className="flex items-center gap-1">
            <ChevronRight className="size-3" />
            {index === values.length - 1 ? <span className="capitalize text-slate-700">{label}</span> : <Link to={path} className="capitalize hover:text-brand-600">{label}</Link>}
          </span>
        );
      })}
    </nav>
  );
}
