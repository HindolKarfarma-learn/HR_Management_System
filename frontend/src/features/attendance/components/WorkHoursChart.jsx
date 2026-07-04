import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export function WorkHoursChart({ records }) {
  const data = records.slice(0, 7).reverse().map((record) => ({ date: record.date.slice(5), hours: record.workHours }));
  return (
    <div className="h-60">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ left: -20 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
          <Tooltip contentStyle={{ borderRadius: 10, borderColor: '#e2e8f0' }} />
          <Bar dataKey="hours" name="Work hours" fill="#2563eb" radius={[5, 5, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
