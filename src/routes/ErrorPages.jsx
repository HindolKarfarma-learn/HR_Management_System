import { ArrowLeft, Home, ShieldAlert } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';

function ErrorPage({ code, title, description, icon: Icon }) {
  const navigate = useNavigate();
  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 p-6 text-center">
      <div>
        <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-brand-50 text-brand-600"><Icon className="size-8" /></span>
        <p className="mt-6 text-sm font-bold tracking-[0.2em] text-brand-600">{code}</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">{title}</h1>
        <p className="mx-auto mt-3 max-w-md text-slate-500">{description}</p>
        <div className="mt-7 flex justify-center gap-3">
          <Button variant="secondary" onClick={() => navigate(-1)}><ArrowLeft className="size-4" />Go back</Button>
          <Link to="/dashboard"><Button><Home className="size-4" />Dashboard</Button></Link>
        </div>
      </div>
    </main>
  );
}

export function NotFoundPage() {
  return <ErrorPage code="404" title="Page not found" description="The page may have moved or no longer exists." icon={ShieldAlert} />;
}

export function UnauthorizedPage() {
  return <ErrorPage code="403" title="Access restricted" description="Your account does not have permission to access this area." icon={ShieldAlert} />;
}
