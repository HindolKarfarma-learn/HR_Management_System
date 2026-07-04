import { api } from './api';
import { mapUser, toUserUpdate } from './apiMappers';
import { paginate, sortRecords } from './serviceUtils';

export const employeeService = {
  async getEmployees({ search = '', department = '', status = '', page = 1, pageSize = 10, sort } = {}) {
    const { data } = await api.get('/employees/', { params: { department: department || undefined } });
    const query = search.trim().toLowerCase();
    const filtered = data.map(mapUser).filter((employee) => {
      const matchesSearch = !query || [employee.name, employee.email, employee.id, employee.designation]
        .some((value) => value.toLowerCase().includes(query));
      return matchesSearch && (!status || employee.status === status);
    });
    return paginate(sortRecords(filtered, sort), page, pageSize);
  },

  async getEmployee(id) {
    const { data } = await api.get(`/employees/${id}`);
    return mapUser(data);
  },

  async updateEmployee(id, payload) {
    const { data } = await api.put(`/employees/${id}`, toUserUpdate(payload));
    return mapUser(data);
  },

  async deleteEmployee(id) {
    await api.delete(`/employees/${id}`);
    return { success: true };
  },

  async getDepartments() {
    const { data } = await api.get('/employees/');
    return [...new Set(data.map((employee) => employee.department).filter(Boolean))].sort();
  },
};
