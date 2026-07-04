import mockEmployees from '../mock/employees.json';
import { copy, paginate, simulateLatency, sortRecords } from './serviceUtils';

let employees = copy(mockEmployees);

export const employeeService = {
  async getEmployees({ search = '', department = '', status = '', page = 1, pageSize = 10, sort } = {}) {
    await simulateLatency();
    const query = search.trim().toLowerCase();
    const filtered = employees.filter((employee) => {
      const matchesSearch = !query || [employee.name, employee.email, employee.id, employee.designation].some((value) => value.toLowerCase().includes(query));
      return matchesSearch && (!department || employee.department === department) && (!status || employee.status === status);
    });
    return copy(paginate(sortRecords(filtered, sort), page, pageSize));
  },

  async getEmployee(id) {
    await simulateLatency();
    const employee = employees.find((record) => record.id === id);
    if (!employee) throw new Error('Employee record not found.');
    return copy(employee);
  },

  async createEmployee(payload) {
    await simulateLatency();
    const employee = { ...payload, id: `EMP-${1001 + employees.length}`, status: 'Active', documents: [], profileCompletion: 70 };
    employees = [employee, ...employees];
    return copy(employee);
  },

  async updateEmployee(id, payload) {
    await simulateLatency();
    const index = employees.findIndex((employee) => employee.id === id);
    if (index < 0) throw new Error('Employee record not found.');
    employees[index] = { ...employees[index], ...payload };
    return copy(employees[index]);
  },

  async deleteEmployee(id) {
    await simulateLatency();
    employees = employees.filter((employee) => employee.id !== id);
    return { success: true };
  },

  async getDepartments() {
    await simulateLatency(150);
    return [...new Set(employees.map((employee) => employee.department))].sort();
  },
};
