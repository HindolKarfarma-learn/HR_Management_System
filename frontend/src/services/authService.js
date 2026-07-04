import { api } from './api';
import { mapUser } from './apiMappers';

const pendingEmailKey = 'peopleflow-pending-email';

export const authService = {
  async login({ email, password }) {
    const form = new URLSearchParams({ username: email, password });
    const { data: tokenData } = await api.post('/auth/login', form, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    const token = tokenData.access_token;
    const { data: user } = await api.get('/employees/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return { user: mapUser(user), token };
  },

  async signup(payload) {
    const { data } = await api.post('/auth/register', {
      employee_id: payload.employeeId,
      email: payload.email,
      password: payload.password,
      role: 'Employee',
      first_name: payload.firstName,
      last_name: payload.lastName,
    });
    localStorage.setItem(pendingEmailKey, payload.email);
    return { user: mapUser(data), message: 'Account created. Verify your email to continue.' };
  },

  async forgotPassword({ email }) {
    const { data } = await api.post('/auth/forgot-password', { email });
    return data;
  },

  async verifyEmail(code) {
    if (code !== '123456') throw new Error('Enter the demo verification code 123456.');
    const email = localStorage.getItem(pendingEmailKey);
    if (!email) throw new Error('Create an account before verifying your email.');
    const { data } = await api.post('/auth/verify-mock', null, { params: { email } });
    localStorage.removeItem(pendingEmailKey);
    return data;
  },

  async resetPassword({ token, password }) {
    if (!token) throw new Error('The password reset link is missing or invalid.');
    const { data } = await api.post('/auth/reset-password', { token, new_password: password });
    return data;
  },

  async me() {
    const { data } = await api.get('/employees/me');
    return mapUser(data);
  },

  async logout() {
    return { success: true };
  },
};
