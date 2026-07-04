import mockPayroll from '../mock/payroll.json';
import { copy, paginate, simulateLatency, sortRecords } from './serviceUtils';

let payroll = copy(mockPayroll);

export const payrollService = {
  async getPayroll({ employeeId, search = '', status = '', page = 1, pageSize = 10, sort } = {}) {
    await simulateLatency();
    const query = search.toLowerCase();
    const filtered = payroll.filter((record) =>
      (!employeeId || record.employeeId === employeeId)
      && (!query || [record.employeeName, record.employeeId].some((value) => value.toLowerCase().includes(query)))
      && (!status || record.status === status),
    );
    return copy(paginate(sortRecords(filtered, sort), page, pageSize));
  },

  async getSalaryDetails(employeeId) {
    await simulateLatency();
    const record = payroll.find((item) => item.employeeId === employeeId);
    if (!record) throw new Error('Payroll record not found.');
    return copy(record);
  },

  async updateSalary(employeeId, payload) {
    await simulateLatency();
    const record = payroll.find((item) => item.employeeId === employeeId);
    if (!record) throw new Error('Payroll record not found.');
    Object.assign(record, payload);
    record.gross = record.basic + record.hra + record.allowances + record.variable;
    record.netPay = record.gross - record.deductions;
    return copy(record);
  },

  async downloadPayslip(employeeId) {
    await simulateLatency(500);
    return { employeeId, message: 'Payslip download will be available when the payroll API is connected.' };
  },
};
