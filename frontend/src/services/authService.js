import mockAuth from '../mock/auth.json';

const wait = (delay = 600) => new Promise((resolve) => setTimeout(resolve, delay));
const publicUser = ({ password: _password, ...user }) => user;

export const authService = {
  async login(credentials) {
    await wait();
    const user = mockAuth.users.find(
      (record) => record.email.toLowerCase() === credentials.email.toLowerCase() && record.password === credentials.password,
    );
    if (!user) throw new Error('Incorrect email or password.');
    return { user: publicUser(user), token: `mock-token-${user.id}` };
  },

  async signup(payload) {
    await wait();
    if (mockAuth.users.some((user) => user.email.toLowerCase() === payload.email.toLowerCase())) {
      throw new Error('An account already exists for this email.');
    }
    return { message: 'Verification email sent successfully.' };
  },

  async forgotPassword() {
    await wait();
    return { message: 'Password reset instructions sent.' };
  },

  async verifyEmail(code) {
    await wait();
    if (code !== '123456') throw new Error('The verification code is invalid.');
    return { message: 'Email verified successfully.' };
  },

  async resetPassword() {
    await wait();
    return { message: 'Your password has been reset.' };
  },

  async me() {
    await wait(250);
    const stored = JSON.parse(localStorage.getItem('peopleflow-session') || '{}');
    const id = stored?.state?.user?.id;
    const user = mockAuth.users.find((record) => record.id === id);
    if (!user) throw new Error('Session expired.');
    return publicUser(user);
  },

  async logout() {
    await wait(200);
    return { success: true };
  },
};
