import dayjs from 'dayjs';
import { api } from './api';
import { mapAttendance, mapLeave, mapUser } from './apiMappers';

const holidays = [
  { name: 'Independence Day', date: `${dayjs().year()}-08-15`, day: 'Saturday' },
  { name: 'Gandhi Jayanti', date: `${dayjs().year()}-10-02`, day: 'Friday' },
  { name: 'Diwali', date: `${dayjs().year()}-11-08`, day: 'Sunday' },
];

function buildTrend(records) {
  return Array.from({ length: 6 }, (_, index) => dayjs().subtract(5 - index, 'month')).map((month) => {
    const monthly = records.filter((record) => dayjs(record.date).isSame(month, 'month'));
    const total = monthly.length || 1;
    return {
      month: month.format('MMM'),
      present: Math.round((monthly.filter((item) => item.status === 'Present').length / total) * 100),
      leave: Math.round((monthly.filter((item) => item.status === 'Leave').length / total) * 100),
      absent: Math.round((monthly.filter((item) => item.status === 'Absent').length / total) * 100),
    };
  });
}

function buildActivities(leaves, employees) {
  const leaveActivities = leaves.slice(0, 2).map((request) => ({
    id: `leave-${request.id}`,
    text: `${request.employeeName} submitted a ${request.type.toLowerCase()} request`,
    time: dayjs(request.startDate).format('DD MMM YYYY'),
    type: 'leave',
  }));
  const employeeActivities = employees.slice(-2).reverse().map((employee) => ({
    id: `employee-${employee.id}`,
    text: `${employee.name} joined the ${employee.department} team`,
    time: employee.joiningDate ? dayjs(employee.joiningDate).format('DD MMM YYYY') : 'Recently',
    type: 'employee',
  }));
  return [...leaveActivities, ...employeeActivities];
}

export const dashboardService = {
  async getDashboard({ role }) {
    const { data: userData } = await api.get('/employees/me');
    const currentEmployee = mapUser(userData);
    const admin = role === 'admin';
    const [employeeResponse, attendanceResponse, leaveResponse, balanceResponse, payrollResponse] = await Promise.all([
      admin ? api.get('/employees/') : Promise.resolve({ data: [userData] }),
      api.get(admin ? '/attendance/all-attendance' : '/attendance/my-attendance'),
      api.get(admin ? '/leaves/all-leaves' : '/leaves/my-leaves'),
      api.get('/leaves/balance'),
      admin ? Promise.resolve({ data: null }) : api.get('/payroll/my-payroll'),
    ]);
    const employees = employeeResponse.data.map(mapUser);
    const attendance = attendanceResponse.data.map(mapAttendance);
    const leaves = leaveResponse.data.map(mapLeave);
    const today = dayjs().format('YYYY-MM-DD');
    const latestPayroll = payrollResponse.data?.history?.[0];
    return {
      role,
      currentEmployee,
      stats: {
        employeeCount: employees.length,
        presentToday: attendance.filter((item) => item.date === today && item.status === 'Present').length,
        onLeave: leaves.filter((item) => item.status === 'Approved' && today >= item.startDate && today <= item.endDate).length,
        pendingRequests: leaves.filter((item) => item.status === 'Pending').length,
      },
      attendanceTrend: buildTrend(attendance),
      recentEmployees: employees.slice(-5).reverse(),
      pendingLeave: leaves.filter((item) => item.status === 'Pending').slice(0, 5),
      activities: buildActivities(leaves, employees),
      holidays,
      employee: {
        leaveBalance: {
          annual: balanceResponse.data.annual.total - balanceResponse.data.annual.used,
          sick: balanceResponse.data.sick.total - balanceResponse.data.sick.used,
          casual: balanceResponse.data.casual.total - balanceResponse.data.casual.used,
        },
        salary: {
          netPay: latestPayroll?.net_salary
            ?? Math.max((payrollResponse.data?.base_salary || 0) + (payrollResponse.data?.allowances || 0) - (payrollResponse.data?.deductions || 0), 0),
          month: latestPayroll ? dayjs(`${latestPayroll.month}-01`).format('MMMM YYYY') : 'Current structure',
          status: latestPayroll?.status || 'Draft',
        },
        profileCompletion: currentEmployee.profileCompletion,
      },
    };
  },
};
