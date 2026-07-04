import dayjs from 'dayjs';
import { api } from './api';
import { mapPayroll } from './apiMappers';
import { paginate, sortRecords } from './serviceUtils';

function mapOverview(record) {
  return mapPayroll({
    id: `salary-${record.employee_id}`,
    employee_code: record.employee_id,
    employee_name: record.employee_name,
    employee_department: record.department,
    employee_job_title: record.job_title,
    month: dayjs().format('YYYY-MM'),
    base_salary: record.base_salary,
    allowances: record.allowances,
    deductions: record.deductions,
    net_salary: record.net_salary,
    status: 'Draft',
  });
}

export const payrollService = {
  async getPayroll({ search = '', status = '', page = 1, pageSize = 10, sort } = {}) {
    const { data } = await api.get('/payroll/salary-overview');
    const query = search.toLowerCase();
    const filtered = data.map(mapOverview).filter((record) =>
      (!query || [record.employeeName, record.employeeId].some((value) => value.toLowerCase().includes(query)))
      && (!status || record.status === status),
    );
    return paginate(sortRecords(filtered, sort), page, pageSize);
  },

  async getSalaryDetails(employeeId) {
    const { data } = await api.get('/payroll/my-payroll');
    if (data.history.length) return mapPayroll(data.history[0]);
    return mapPayroll({
      id: `salary-${employeeId}`,
      employee_code: employeeId,
      month: dayjs().format('YYYY-MM'),
      base_salary: data.base_salary,
      allowances: data.allowances,
      deductions: data.deductions,
      net_salary: Math.max(data.base_salary + data.allowances - data.deductions, 0),
      status: 'Draft',
    });
  },

  async updateSalary(employeeId, payload) {
    const baseSalary = Number(payload.basic || 0);
    const allowances = Number(payload.hra || 0) + Number(payload.allowances || 0) + Number(payload.variable || 0);
    const deductions = Number(payload.deductions || 0);
    const { data } = await api.put(`/payroll/${employeeId}/salary-structure`, {
      base_salary: baseSalary,
      allowances,
      deductions,
    });
    return mapOverview({
      employee_id: data.employee_id,
      employee_name: [data.first_name, data.last_name].filter(Boolean).join(' ') || data.email,
      department: data.department,
      job_title: data.job_title,
      base_salary: data.base_salary,
      allowances: data.allowances,
      deductions: data.deductions,
      net_salary: Math.max(data.base_salary + data.allowances - data.deductions, 0),
    });
  },

  async downloadPayslip(employeeId) {
    return {
      employeeId,
      message: 'Payslip PDF generation is not available yet. Payroll data is connected.',
    };
  },
};
