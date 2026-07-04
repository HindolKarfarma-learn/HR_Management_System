import { mkdir, writeFile } from 'node:fs/promises';

const names = [
  'Aarav Mehta', 'Nisha Kapoor', 'Rohan Iyer', 'Ananya Bose', 'Vikram Sethi',
  'Meera Nair', 'Kabir Malhotra', 'Ishita Rao', 'Arjun Desai', 'Saanvi Kulkarni',
  'Dev Khanna', 'Priya Menon', 'Aditya Sharma', 'Kavya Reddy', 'Neel Joshi',
  'Tanvi Shah', 'Rahul Bhatia', 'Diya Verma', 'Siddharth Jain', 'Riya Mukherjee',
  'Varun Pillai', 'Aditi Chawla', 'Karan Oberoi', 'Sneha Patil', 'Yash Gupta',
  'Pooja Krishnan', 'Manav Arora', 'Tara Srinivasan', 'Harsh Vardhan', 'Simran Kaur',
  'Abhinav Roy', 'Maya Thomas', 'Dhruv Saxena', 'Aisha Fernandes', 'Nikhil Dutta',
  'Shreya Banerjee', 'Aryan Ghosh', 'Ritu Agrawal', 'Sameer Qureshi', 'Nandini Das',
  'Parth Trivedi', 'Zoya Mirza', 'Akash Shetty', 'Lakshmi Narayan', 'Vihaan Goel',
  'Neha Suri', 'Omkar Jadhav', 'Sakshi Anand', 'Reyansh Bansal', 'Kriti Mathur',
];
const teams = [
  ['Engineering', 'Software Engineer'], ['Engineering', 'Senior Software Engineer'],
  ['Product', 'Product Manager'], ['Product Design', 'Product Designer'],
  ['Sales', 'Account Executive'], ['Marketing', 'Growth Specialist'],
  ['Finance', 'Financial Analyst'], ['People Operations', 'HR Business Partner'],
  ['Customer Success', 'Customer Success Manager'], ['Operations', 'Operations Analyst'],
];
const locations = ['Bengaluru', 'Mumbai', 'New Delhi', 'Hyderabad', 'Pune', 'Chennai'];
const managers = ['Aarav Mehta', 'Meera Nair', 'Vikram Sethi', 'Priya Menon', 'Rahul Bhatia'];
const leaveTypes = ['Annual Leave', 'Sick Leave', 'Casual Leave', 'Compensatory Off'];
const leaveReasons = ['Family commitment', 'Medical appointment', 'Personal work', 'Planned vacation', 'Festival travel'];
const leaveStatuses = ['Pending', 'Approved', 'Approved', 'Rejected'];
const attendanceStatuses = ['Present', 'Present', 'Present', 'Present', 'Half Day', 'Leave', 'Absent'];

const slug = (name) => name.toLowerCase().replaceAll(' ', '.');
const isoDate = (daysAgo = 0) => {
  const date = new Date('2026-07-04T12:00:00Z');
  date.setUTCDate(date.getUTCDate() - daysAgo);
  return date.toISOString().slice(0, 10);
};

const employees = names.map((name, index) => {
  const [department, designation] = teams[index % teams.length];
  const joinYear = 2018 + (index % 8);
  const salary = 720000 + (index % 10) * 95000 + Math.floor(index / 10) * 120000;
  return {
    id: `EMP-${String(1001 + index).padStart(4, '0')}`,
    name,
    email: `${slug(name)}@peopleflow.io`,
    phone: `+91 ${90000 + index * 137} ${12000 + index * 73}`,
    department,
    designation: index < 5 ? ['HR Director', 'Design Lead', 'Engineering Manager', 'Product Lead', 'Sales Director'][index] : designation,
    manager: index < 5 ? 'Executive Leadership' : managers[index % managers.length],
    location: locations[index % locations.length],
    employmentType: index % 9 === 0 ? 'Contract' : 'Full-time',
    status: index % 13 === 0 && index > 0 ? 'On Leave' : 'Active',
    joiningDate: `${joinYear}-${String((index % 12) + 1).padStart(2, '0')}-${String((index % 24) + 1).padStart(2, '0')}`,
    birthDate: `${1986 + (index % 13)}-${String((index % 12) + 1).padStart(2, '0')}-${String((index % 24) + 1).padStart(2, '0')}`,
    gender: index % 2 ? 'Female' : 'Male',
    address: `${34 + index}, ${['Indiranagar', 'Bandra West', 'Saket', 'Hitech City', 'Koregaon Park'][index % 5]}, ${locations[index % locations.length]}`,
    emergencyContact: { name: `${name.split(' ')[0]} Family`, relationship: index % 2 ? 'Parent' : 'Spouse', phone: `+91 98${String(76543000 + index * 41).slice(-8)}` },
    salary: { annual: salary, basic: Math.round(salary * 0.5), hra: Math.round(salary * 0.2), allowances: Math.round(salary * 0.2), variable: Math.round(salary * 0.1) },
    documents: [
      { id: `DOC-${index + 1}-1`, name: 'Employment Agreement.pdf', type: 'Contract', uploadedAt: isoDate(200 + index) },
      { id: `DOC-${index + 1}-2`, name: 'Identity Verification.pdf', type: 'Identity', uploadedAt: isoDate(180 + index) },
    ],
    profileCompletion: 82 + (index % 5) * 4,
  };
});

const attendance = employees.flatMap((employee, employeeIndex) =>
  Array.from({ length: 35 }, (_, dayIndex) => {
    const status = attendanceStatuses[(employeeIndex + dayIndex * 3) % attendanceStatuses.length];
    return {
      id: `ATT-${employeeIndex + 1}-${dayIndex + 1}`,
      employeeId: employee.id,
      employeeName: employee.name,
      date: isoDate(dayIndex),
      checkIn: status === 'Present' || status === 'Half Day' ? `0${8 + ((employeeIndex + dayIndex) % 2)}:${String(5 + (employeeIndex * 7 + dayIndex) % 50).padStart(2, '0')}` : null,
      checkOut: status === 'Present' ? `1${7 + ((employeeIndex + dayIndex) % 3)}:${String(10 + (employeeIndex * 3 + dayIndex) % 45).padStart(2, '0')}` : status === 'Half Day' ? '13:30' : null,
      workHours: status === 'Present' ? Number((8.1 + ((employeeIndex + dayIndex) % 12) / 10).toFixed(1)) : status === 'Half Day' ? 4.5 : 0,
      status,
    };
  }),
);

const leave = Array.from({ length: 32 }, (_, index) => {
  const employee = employees[(index * 7 + 1) % employees.length];
  const duration = (index % 3) + 1;
  return {
    id: `LR-${String(2026001 + index)}`,
    employeeId: employee.id,
    employeeName: employee.name,
    department: employee.department,
    type: leaveTypes[index % leaveTypes.length],
    startDate: isoDate(index - 10),
    endDate: isoDate(index - 10 - duration + 1),
    days: duration,
    reason: leaveReasons[index % leaveReasons.length],
    status: leaveStatuses[index % leaveStatuses.length],
    appliedOn: isoDate(index + 3),
    comments: index % 4 === 3 ? 'Please discuss alternate dates with your manager.' : '',
  };
});

const payroll = employees.map((employee, index) => {
  const monthly = Math.round(employee.salary.annual / 12);
  const deductions = Math.round(monthly * (0.1 + (index % 3) * 0.01));
  return {
    id: `PAY-2026-06-${employee.id}`,
    employeeId: employee.id,
    employeeName: employee.name,
    department: employee.department,
    designation: employee.designation,
    month: 'June 2026',
    basic: Math.round(employee.salary.basic / 12),
    hra: Math.round(employee.salary.hra / 12),
    allowances: Math.round(employee.salary.allowances / 12),
    variable: Math.round(employee.salary.variable / 12),
    gross: monthly,
    deductions,
    netPay: monthly - deductions,
    status: index % 11 === 0 ? 'Processing' : 'Paid',
    paidOn: index % 11 === 0 ? null : '2026-06-30',
  };
});

const dashboard = {
  stats: { employeeCount: 50, presentToday: 42, onLeave: 5, pendingRequests: 8 },
  attendanceTrend: [
    { month: 'Jan', present: 91, leave: 6, absent: 3 }, { month: 'Feb', present: 93, leave: 5, absent: 2 },
    { month: 'Mar', present: 89, leave: 8, absent: 3 }, { month: 'Apr', present: 92, leave: 6, absent: 2 },
    { month: 'May', present: 94, leave: 4, absent: 2 }, { month: 'Jun', present: 92, leave: 6, absent: 2 },
  ],
  departmentDistribution: teams.filter((team, index) => index % 2 === 0).map(([name], index) => ({ name, employees: [14, 8, 9, 6, 7][index] })),
  holidays: [
    { name: 'Independence Day', date: '2026-08-15', day: 'Saturday' },
    { name: 'Raksha Bandhan', date: '2026-08-28', day: 'Friday' },
    { name: 'Gandhi Jayanti', date: '2026-10-02', day: 'Friday' },
  ],
  activities: [
    { id: 1, text: 'Nisha Kapoor submitted a leave request', time: '12 minutes ago', type: 'leave' },
    { id: 2, text: 'June payroll processing completed', time: '2 hours ago', type: 'payroll' },
    { id: 3, text: 'Kriti Mathur joined the Marketing team', time: 'Yesterday', type: 'employee' },
    { id: 4, text: 'Attendance policy was updated', time: '2 days ago', type: 'attendance' },
  ],
  employee: {
    leaveBalance: { annual: 12, sick: 7, casual: 4 },
    salary: { netPay: 102450, month: 'June 2026', status: 'Paid' },
    profileCompletion: 92,
  },
};

const notifications = dashboard.activities.map((activity) => ({ ...activity, read: activity.id > 2 }));

await mkdir('src/mock', { recursive: true });
const files = { employees, attendance, leave, payroll, dashboard, notifications };
await Promise.all(Object.entries(files).map(([name, data]) => writeFile(`src/mock/${name}.json`, `${JSON.stringify(data, null, 2)}\n`)));
console.log(`Generated ${employees.length} employees, ${attendance.length} attendance records, ${leave.length} leave requests, and ${payroll.length} payroll records.`);
