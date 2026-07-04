import { useState } from 'react';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import { BriefcaseBusiness, FileText, Mail, MapPin, Pencil, Phone, ShieldCheck } from 'lucide-react';
import { PageHeader } from '../../../components/layout/PageHeader';
import { FileUpload } from '../../../components/forms/FileUpload';
import { Avatar } from '../../../components/ui/Avatar';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Card, CardContent, CardHeader } from '../../../components/ui/Card';
import { Modal } from '../../../components/ui/Modal';
import { PageSkeleton } from '../../../components/ui/Skeleton';
import { useAuthStore } from '../../../store/authStore';
import { ProfileForm } from '../components/ProfileForm';
import { useProfile, useUpdateProfile } from '../hooks/useProfile';

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user);
  const [editing, setEditing] = useState(false);
  const { data: profile, isLoading } = useProfile(user.id);
  const update = useUpdateProfile();
  if (isLoading) return <PageSkeleton />;
  const save = (values) => update.mutate({ employeeId: profile.id, values }, { onSuccess: () => { toast.success('Profile updated'); setEditing(false); } });
  return (
    <>
      <PageHeader title="My profile" description="Manage your personal details and employee information." action={<Button onClick={() => setEditing(true)}><Pencil className="size-4" />Edit profile</Button>} />
      <div className="grid gap-6 xl:grid-cols-[340px_1fr]">
        <div className="space-y-6">
          <Card><CardContent className="text-center"><div className="relative mx-auto w-fit"><Avatar name={profile.name} size="xl" /><span className="absolute -bottom-1 -right-1 grid size-7 place-items-center rounded-full bg-emerald-500 text-white ring-4 ring-white"><ShieldCheck className="size-4" /></span></div><h2 className="mt-4 text-xl font-bold text-slate-900">{profile.name}</h2><p className="mt-1 text-sm text-slate-500">{profile.designation}</p><Badge variant="info" className="mt-3">{profile.department}</Badge><div className="mt-5"><FileUpload label="Upload new avatar" accept="image/png,image/jpeg" hint="PNG or JPG up to 5 MB" onChange={() => toast.success('Avatar selected. Upload API will be connected later.')} /></div></CardContent></Card>
          <Card><CardHeader title="Profile completion" /><CardContent><div className="flex items-end justify-between"><strong className="text-3xl text-slate-900">{profile.profileCompletion}%</strong><span className="text-xs text-slate-500">Almost there</span></div><div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-brand-600" style={{ width: `${profile.profileCompletion}%` }} /></div></CardContent></Card>
        </div>
        <div className="space-y-6">
          <Card><CardHeader title="Personal information" /><CardContent className="grid gap-6 sm:grid-cols-2"><Info icon={Mail} label="Work email" value={profile.email} /><Info icon={Phone} label="Phone" value={profile.phone} /><Info icon={MapPin} label="Address" value={profile.address} /><Info icon={BriefcaseBusiness} label="Employee ID" value={profile.id} /><Info label="Date of birth" value={profile.birthDate ? dayjs(profile.birthDate).format('DD MMMM YYYY') : 'Not provided'} /><Info label="Gender" value={profile.gender} /></CardContent></Card>
          <div className="grid gap-6 lg:grid-cols-2">
            <Card><CardHeader title="Emergency contact" /><CardContent><p className="font-semibold text-slate-800">{profile.emergencyContact.name || 'Not provided'}</p><p className="mt-1 text-sm text-slate-500">{profile.emergencyContact.relationship || 'Relationship not provided'}</p><p className="mt-3 flex items-center gap-2 text-sm text-slate-600"><Phone className="size-4" />{profile.emergencyContact.phone || 'Not provided'}</p></CardContent></Card>
            <Card><CardHeader title="Job information" /><CardContent><Info label="Manager" value={profile.manager} /><div className="mt-4"><Info label="Joining date" value={dayjs(profile.joiningDate).format('DD MMM YYYY')} /></div></CardContent></Card>
          </div>
          <Card><CardHeader title="Documents" /><CardContent className="grid gap-3 sm:grid-cols-2">{profile.documents.map((document) => <div key={document.id} className="flex items-center gap-3 rounded-lg border border-slate-100 p-3"><FileText className="size-5 text-brand-600" /><div className="min-w-0"><p className="truncate text-sm font-semibold text-slate-800">{document.name}</p><p className="text-xs text-slate-500">{document.type}</p></div></div>)}</CardContent></Card>
        </div>
      </div>
      <Modal open={editing} onClose={() => setEditing(false)} title="Edit profile" description="Keep your contact and emergency information current.">{editing && <ProfileForm profile={profile} onSubmit={save} onCancel={() => setEditing(false)} loading={update.isPending} />}</Modal>
    </>
  );
}

function Info({ icon: Icon, label, value }) {
  return <div className="flex gap-3">{Icon && <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-slate-100 text-slate-500"><Icon className="size-4" /></span>}<div><p className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p><p className="mt-1 text-sm font-semibold text-slate-800">{value || 'Not provided'}</p></div></div>;
}
