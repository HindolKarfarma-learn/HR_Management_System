import dayjs from 'dayjs';

const fullName = (record) =>
  [record.first_name, record.last_name].filter(Boolean).join(' ') || record.email || 'Unnamed employee';

export function mapUser(record) {
  const monthlyGross = Number(record.base_salary || 0) + Number(record.allowances || 0);
  const completionFields = [
    record.first_name, record.last_name, record.phone, record.address,
    record.job_title, record.department, record.joining_date,
  ];
  const completion = Math.round((completionFields.filter(Boolean).length / completionFields.length) * 100);
  return {
    id: record.employee_id,
    databaseId: record.id,
    employeeId: record.employee_id,
    name: fullName(record),
    firstName: record.first_name || fullName(record).split(' ')[0],
    lastName: record.last_name || '',
    email: record.email,
    phone: record.phone || 'Not provided',
    department: record.department || 'Unassigned',
    designation: record.job_title || 'Employee',
    manager: 'Not assigned',
    location: 'Not specified',
    employmentType: 'Full-time',
    status: record.is_verified ? 'Active' : 'Inactive',
    birthDate: null,
    gender: 'Not provided',
    role: String(record.role || 'Employee').toLowerCase(),
    joiningDate: record.joining_date,
    address: record.address || 'Not provided',
    avatar: record.profile_picture_url,
    emergencyContact: {
      name: 'Not provided',
      relationship: 'Emergency contact',
      phone: 'Not provided',
    },
    salary: {
      annual: monthlyGross * 12,
      basic: Number(record.base_salary || 0) * 12,
      hra: 0,
      allowances: Number(record.allowances || 0) * 12,
      variable: 0,
      deductions: Number(record.deductions || 0) * 12,
    },
    documents: [],
    profileCompletion: completion,
  };
}

export function toUserUpdate(values) {
  const names = String(values.name || '').trim().split(/\s+/);
  return {
    first_name: names.shift() || undefined,
    last_name: names.join(' ') || undefined,
    email: values.email,
    phone: values.phone,
    address: values.address,
    job_title: values.designation,
    department: values.department,
  };
}

export function mapAttendance(record) {
  const checkIn = record.check_in ? dayjs(record.check_in) : null;
  const checkOut = record.check_out ? dayjs(record.check_out) : null;
  return {
    id: record.id,
    employeeId: record.employee_code || String(record.employee_id),
    employeeName: record.employee_name || 'Employee',
    date: record.date,
    checkIn: checkIn ? checkIn.format('HH:mm') : null,
    checkOut: checkOut ? checkOut.format('HH:mm') : null,
    workHours: checkIn && checkOut ? Number((checkOut.diff(checkIn, 'minute') / 60).toFixed(1)) : 0,
    status: record.status === 'Half-day' ? 'Half Day' : record.status,
    remarks: record.remarks,
  };
}

export function mapLeave(record) {
  return {
    id: record.id,
    employeeId: record.employee_code || String(record.employee_id),
    employeeName: record.employee_name || 'Employee',
    department: record.employee_department || 'Unassigned',
    type: record.leave_type,
    startDate: record.start_date,
    endDate: record.end_date,
    days: dayjs(record.end_date).diff(dayjs(record.start_date), 'day') + 1,
    reason: record.remarks || 'No reason provided',
    status: record.status,
    appliedOn: record.start_date,
    comments: record.admin_comment || '',
  };
}

export function mapPayroll(record) {
  const basic = Number(record.base_salary || 0);
  const allowances = Number(record.allowances || 0);
  const deductions = Number(record.deductions || 0);
  return {
    id: record.id,
    employeeId: record.employee_code || String(record.employee_id),
    employeeName: record.employee_name || 'Employee',
    department: record.employee_department || 'Unassigned',
    designation: record.employee_job_title || 'Employee',
    month: dayjs(`${record.month}-01`).format('MMMM YYYY'),
    monthKey: record.month,
    basic,
    hra: 0,
    allowances,
    variable: 0,
    gross: basic + allowances,
    deductions,
    netPay: Number(record.net_salary ?? basic + allowances - deductions),
    status: record.status === 'Draft' ? 'Processing' : record.status,
    paidOn: null,
  };
}
