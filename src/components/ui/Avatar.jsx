import { cn } from '../../utils/cn';

const dimensions = { sm: 'size-8 text-xs', md: 'size-10 text-sm', lg: 'size-16 text-lg', xl: 'size-24 text-2xl' };

function getInitials(name = '') {
  return name.split(' ').slice(0, 2).map((part) => part[0]).join('').toUpperCase();
}

export function Avatar({ name, src, size = 'md', className }) {
  return src ? (
    <img className={cn('rounded-full object-cover', dimensions[size], className)} src={src} alt={`${name} profile`} />
  ) : (
    <span className={cn('inline-grid shrink-0 place-items-center rounded-full bg-brand-100 font-semibold text-brand-700', dimensions[size], className)} aria-label={name}>
      {getInitials(name)}
    </span>
  );
}
