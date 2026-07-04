import mockAttendance from '../mock/attendance.json';
import { copy, paginate, simulateLatency, sortRecords } from './serviceUtils';

let records = copy(mockAttendance);

export const attendanceService = {
  async getAttendance({ employeeId, search = '', status = '', date = '', page = 1, pageSize = 10, sort } = {}) {
    await simulateLatency();
    const query = search.toLowerCase();
    const filtered = records.filter((record) =>
      (!employeeId || record.employeeId === employeeId)
      && (!query || record.employeeName.toLowerCase().includes(query))
      && (!status || record.status === status)
      && (!date || record.date === date),
    );
    return copy(paginate(sortRecords(filtered, sort), page, pageSize));
  },

  async getEmployeeSummary(employeeId) {
    await simulateLatency(250);
    const employeeRecords = records.filter((record) => record.employeeId === employeeId);
    const counts = employeeRecords.reduce((summary, record) => ({ ...summary, [record.status]: (summary[record.status] || 0) + 1 }), {});
    return { counts, averageHours: Number((employeeRecords.reduce((sum, item) => sum + item.workHours, 0) / employeeRecords.length).toFixed(1)) };
  },

  async checkIn(employee) {
    await simulateLatency();
    const record = {
      id: `ATT-${Date.now()}`, employeeId: employee.id, employeeName: employee.name,
      date: new Date().toISOString().slice(0, 10), checkIn: new Date().toTimeString().slice(0, 5),
      checkOut: null, workHours: 0, status: 'Present',
    };
    records = [record, ...records.filter((item) => !(item.employeeId === employee.id && item.date === record.date))];
    return copy(record);
  },

  async checkOut(employeeId) {
    await simulateLatency();
    const record = records.find((item) => item.employeeId === employeeId);
    if (!record) throw new Error('No active attendance record.');
    record.checkOut = new Date().toTimeString().slice(0, 5);
    record.workHours = 8.5;
    return copy(record);
  },
};
