import mockLeave from '../mock/leave.json';
import { copy, paginate, simulateLatency, sortRecords } from './serviceUtils';

let requests = copy(mockLeave);

export const leaveService = {
  async getLeaveRequests({ employeeId, search = '', status = '', page = 1, pageSize = 10, sort } = {}) {
    await simulateLatency();
    const query = search.toLowerCase();
    const filtered = requests.filter((request) =>
      (!employeeId || request.employeeId === employeeId)
      && (!query || request.employeeName.toLowerCase().includes(query))
      && (!status || request.status === status),
    );
    return copy(paginate(sortRecords(filtered, sort), page, pageSize));
  },

  async getLeaveBalance() {
    await simulateLatency(250);
    return { annual: { total: 18, used: 6 }, sick: { total: 10, used: 3 }, casual: { total: 8, used: 4 } };
  },

  async applyLeave(payload, employee) {
    await simulateLatency();
    const request = {
      id: `LR-${Date.now()}`, employeeId: employee.id, employeeName: employee.name,
      department: employee.department, ...payload, status: 'Pending',
      appliedOn: new Date().toISOString().slice(0, 10), comments: '',
    };
    requests = [request, ...requests];
    return copy(request);
  },

  async updateLeaveStatus(id, status, comments = '') {
    await simulateLatency();
    const request = requests.find((item) => item.id === id);
    if (!request) throw new Error('Leave request not found.');
    Object.assign(request, { status, comments });
    return copy(request);
  },
};
