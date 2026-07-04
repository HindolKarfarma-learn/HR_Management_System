import { UploadCloud } from 'lucide-react';

export function FileUpload({ label = 'Upload file', accept, onChange, hint = 'PDF, PNG or JPG up to 5 MB' }) {
  return (
    <label className="flex cursor-pointer flex-col items-center rounded-xl border-2 border-dashed border-slate-200 p-6 text-center transition hover:border-brand-300 hover:bg-brand-50/40">
      <UploadCloud className="size-7 text-brand-600" />
      <span className="mt-2 text-sm font-semibold text-slate-800">{label}</span>
      <span className="mt-1 text-xs text-slate-500">{hint}</span>
      <input type="file" accept={accept} onChange={onChange} className="sr-only" />
    </label>
  );
}
