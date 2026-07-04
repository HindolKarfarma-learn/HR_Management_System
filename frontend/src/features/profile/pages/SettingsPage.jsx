import { useState } from 'react';
import toast from 'react-hot-toast';
import { Bell, LockKeyhole, Mail, Smartphone } from 'lucide-react';
import { PageHeader } from '../../../components/layout/PageHeader';
import { Button } from '../../../components/ui/Button';
import { Card, CardContent, CardHeader } from '../../../components/ui/Card';

const initialSettings = [
  { id: 'email', title: 'Email notifications', description: 'Receive leave, payroll, and policy updates by email.', icon: Mail, enabled: true },
  { id: 'push', title: 'Push notifications', description: 'Receive important alerts on registered devices.', icon: Bell, enabled: true },
  { id: 'attendance', title: 'Attendance reminders', description: 'Get check-in and check-out reminders.', icon: Smartphone, enabled: false },
];

export default function SettingsPage() {
  const [settings, setSettings] = useState(initialSettings);
  const toggle = (id) => setSettings((items) => items.map((item) => item.id === id ? { ...item, enabled: !item.enabled } : item));
  return (
    <>
      <PageHeader title="Settings" description="Manage notifications, security, and workspace preferences." />
      <div className="max-w-3xl space-y-6">
        <Card><CardHeader title="Notifications" description="Choose how PeopleFlow keeps you informed." /><CardContent className="divide-y divide-slate-100">{settings.map((item) => <div key={item.id} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0"><span className="grid size-10 place-items-center rounded-lg bg-slate-100 text-slate-600"><item.icon className="size-5" /></span><div className="flex-1"><p className="text-sm font-semibold text-slate-800">{item.title}</p><p className="mt-1 text-xs text-slate-500">{item.description}</p></div><button type="button" role="switch" aria-checked={item.enabled} onClick={() => toggle(item.id)} className={`relative h-6 w-11 rounded-full transition ${item.enabled ? 'bg-brand-600' : 'bg-slate-300'}`}><span className={`absolute top-0.5 size-5 rounded-full bg-white shadow transition ${item.enabled ? 'left-5.5' : 'left-0.5'}`} /></button></div>)}</CardContent></Card>
        <Card><CardHeader title="Security" description="Manage your account security." /><CardContent className="flex items-center gap-4"><span className="grid size-10 place-items-center rounded-lg bg-brand-50 text-brand-600"><LockKeyhole className="size-5" /></span><div className="flex-1"><p className="text-sm font-semibold text-slate-800">Password</p><p className="text-xs text-slate-500">Last changed 48 days ago</p></div><Button variant="secondary" onClick={() => toast.success('Password reset instructions sent.')}>Change password</Button></CardContent></Card>
        <Button onClick={() => toast.success('Preferences saved')}>Save preferences</Button>
      </div>
    </>
  );
}
