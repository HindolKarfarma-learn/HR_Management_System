import { api } from './api';
import { mapAttendance } from './apiMappers';
import { getSessionUser, paginate, sortRecords } from './serviceUtils';

const isAdmin = () => getSessionUser()?.role === 'admin';

async function fetchAttendance({ employeeId, date } = {}) {
  const endpoint = isAdmin() ? '/attendance/all-attendance' : '/attendance/my-attendance';
  const params = isAdmin()
    ? { employee_id: employeeId || undefined, date_filter: date || undefined }
    : { start_date: date || undefined, end_date: date || undefined };
  const { data } = await api.get(endpoint, { params });
  return data.map(mapAttendance);
}

export const attendanceService = {
  async getAttendance({ employeeId, search = '', status = '', date = '', page = 1, pageSize = 10, sort } = {}) {
    const query = search.toLowerCase();
    const records = await fetchAttendance({ employeeId, date });
    const filtered = records.filter((record) =>
      (!query || record.employeeName.toLowerCase().includes(query))
      && (!status || record.status === status),
    );
    return paginate(sortRecords(filtered, sort), page, pageSize);
  },

  async getEmployeeSummary(employeeId) {
    const records = await fetchAttendance({ employeeId });
    const counts = records.reduce(
      (summary, record) => ({ ...summary, [record.status]: (summary[record.status] || 0) + 1 }),
      {},
    );
    const workedDays = records.filter((record) => record.workHours > 0);
    return {
      counts,
      averageHours: workedDays.length
        ? Number((workedDays.reduce((sum, item) => sum + item.workHours, 0) / workedDays.length).toFixed(1))
        : 0,
    };
  },

  async checkIn() {
    const { data } = await api.post('/attendance/check-in', {});
    return mapAttendance(data);
  },

  async checkOut() {
    const { data } = await api.post('/attendance/check-out', {});
    return mapAttendance(data);
  },
};
