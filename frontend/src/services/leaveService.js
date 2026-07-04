import { api } from './api';
import { mapLeave } from './apiMappers';
import { getSessionUser, paginate, sortRecords } from './serviceUtils';

export const leaveService = {
  async getLeaveRequests({ search = '', status = '', page = 1, pageSize = 10, sort } = {}) {
    const admin = getSessionUser()?.role === 'admin';
    const endpoint = admin ? '/leaves/all-leaves' : '/leaves/my-leaves';
    const { data } = await api.get(endpoint, {
      params: admin ? { status_filter: status || undefined } : undefined,
    });
    const query = search.toLowerCase();
    const filtered = data.map(mapLeave).filter((request) =>
      (!query || request.employeeName.toLowerCase().includes(query))
      && (!status || request.status === status),
    );
    return paginate(sortRecords(filtered, sort), page, pageSize);
  },

  async getLeaveBalance() {
    const { data } = await api.get('/leaves/balance');
    return data;
  },

  async applyLeave(payload) {
    const { data } = await api.post('/leaves/apply', {
      leave_type: payload.type,
      start_date: payload.startDate,
      end_date: payload.endDate,
      remarks: payload.reason,
    });
    return mapLeave(data);
  },

  async updateLeaveStatus(id, status, comments = '') {
    const action = status === 'Approved' ? 'approve' : 'reject';
    const { data } = await api.post(`/leaves/${id}/${action}`, { admin_comment: comments });
    return mapLeave(data);
  },
};
