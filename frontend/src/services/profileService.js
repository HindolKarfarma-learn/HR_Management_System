import { api } from './api';
import { mapUser, toUserUpdate } from './apiMappers';

export const profileService = {
  async getProfile() {
    const { data } = await api.get('/employees/me');
    return mapUser(data);
  },

  async updateProfile(_employeeId, payload) {
    const { data } = await api.put('/employees/me', toUserUpdate(payload));
    return mapUser(data);
  },
};
