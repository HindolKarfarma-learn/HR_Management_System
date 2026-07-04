import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export function AttendanceChart({ data }) {
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ left: -20, right: 8 }}>
          <defs>
            <linearGradient id="presentGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} domain={[0, 100]} />
          <Tooltip contentStyle={{ borderRadius: 10, borderColor: '#e2e8f0' }} />
          <Legend wrapperStyle={{ fontSize: 12, paddingTop: 16 }} />
          <Area type="monotone" dataKey="present" name="Present %" stroke="#2563eb" fill="url(#presentGradient)" strokeWidth={2.5} />
          <Area type="monotone" dataKey="leave" name="Leave %" stroke="#f59e0b" fill="transparent" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
