import mockEmployees from '../mock/employees.json';
import { copy, simulateLatency } from './serviceUtils';

let profiles = copy(mockEmployees);

export const profileService = {
  async getProfile(employeeId) {
    await simulateLatency();
    return copy(profiles.find((employee) => employee.id === employeeId) || profiles[0]);
  },
  async updateProfile(employeeId, payload) {
    await simulateLatency();
    const index = profiles.findIndex((employee) => employee.id === employeeId);
    if (index < 0) throw new Error('Profile not found.');
    profiles[index] = { ...profiles[index], ...payload };
    return copy(profiles[index]);
  },
};
