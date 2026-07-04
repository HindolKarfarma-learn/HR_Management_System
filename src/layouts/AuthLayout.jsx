import { CheckCircle2 } from 'lucide-react';
import { Outlet } from 'react-router-dom';
import { Brand } from '../components/layout/Brand';

const benefits = ['One workspace for your entire team', 'Accurate attendance and payroll', 'Simple, transparent leave workflows'];

export default function AuthLayout() {
  return (
    <main className="grid min-h-screen bg-white lg:grid-cols-[1.05fr_0.95fr]">
      <section className="hidden overflow-hidden bg-slate-950 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <Brand inverse />
        <div className="max-w-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-400">People operations, elevated</p>
          <h1 className="mt-5 text-5xl font-bold leading-tight">Give your people the tools to do their best work.</h1>
          <p className="mt-5 text-lg leading-8 text-slate-300">A modern HR workspace built for growing teams, thoughtful leaders, and happier employees.</p>
          <ul className="mt-9 space-y-4">
            {benefits.map((benefit) => (
              <li key={benefit} className="flex items-center gap-3 text-slate-200"><CheckCircle2 className="size-5 text-brand-400" />{benefit}</li>
            ))}
          </ul>
        </div>
        <p className="text-sm text-slate-500">© 2026 PeopleFlow. Built for modern teams.</p>
      </section>
      <section className="flex min-h-screen items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <div className="mb-10 lg:hidden"><Brand /></div>
          <Outlet />
        </div>
      </section>
    </main>
  );
}
