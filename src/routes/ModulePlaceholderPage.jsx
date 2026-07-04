import { PageHeader } from '../components/layout/PageHeader';
import { Card, CardContent } from '../components/ui/Card';

export default function ModulePlaceholderPage({ title, description }) {
  return (
    <>
      <PageHeader title={title} description={description} />
      <Card>
        <CardContent className="grid min-h-72 place-items-center text-center">
          <div>
            <p className="text-sm font-semibold text-brand-600">PeopleFlow</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">{title} workspace</h2>
            <p className="mt-2 max-w-md text-sm text-slate-500">This module is being assembled on the shared service and component foundation.</p>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
