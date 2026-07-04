import { Card, CardContent, CardHeader } from '../ui/Card';

export function ChartCard({ title, description, action, children, className }) {
  return (
    <Card className={className}>
      <CardHeader title={title} description={description} action={action} />
      <CardContent>{children}</CardContent>
    </Card>
  );
}
