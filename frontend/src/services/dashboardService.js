import mockDashboard from '../mock/dashboard.json';
import mockEmployees from '../mock/employees.json';
import mockLeave from '../mock/leave.json';
import { copy, simulateLatency } from './serviceUtils';

export const dashboardService = {
  async getDashboard({ role, employeeId }) {
    await simulateLatency();
    const employee = mockEmployees.find((record) => record.id === employeeId) || mockEmployees[0];
    return copy({
      ...mockDashboard,
      role,
      currentEmployee: employee,
      recentEmployees: mockEmployees.slice(-5).reverse(),
      pendingLeave: mockLeave.filter((request) => request.status === 'Pending').slice(0, 5),
    });
  },
};
