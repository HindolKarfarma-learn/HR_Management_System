export function AuthHeader({ eyebrow, title, description }) {
  return (
    <header className="mb-8">
      {eyebrow && <p className="mb-2 text-sm font-semibold text-brand-600">{eyebrow}</p>}
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">{title}</h1>
      <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
    </header>
  );
}
