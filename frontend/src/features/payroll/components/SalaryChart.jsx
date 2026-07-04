import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

const colors = ['#2563eb', '#8b5cf6', '#14b8a6', '#f59e0b'];

export function SalaryChart({ salary }) {
  const data = ['basic', 'hra', 'allowances', 'variable'].map((key) => ({ name: key[0].toUpperCase() + key.slice(1), value: salary[key] }));
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={62} outerRadius={92} paddingAngle={3}>
            {data.map((item, index) => <Cell key={item.name} fill={colors[index]} />)}
          </Pie>
          <Tooltip formatter={(value) => new Intl.NumberFormat('en-IN').format(value)} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
