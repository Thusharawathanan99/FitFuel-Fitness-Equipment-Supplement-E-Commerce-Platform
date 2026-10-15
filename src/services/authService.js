import { ok, fail, apiRequest } from './http';
import { storage } from '../utils/storage';

const USERS = 'users';
const SESSION = 'session';
const TOKEN_KEY = 'fitfuel:token';

const seed = () => {
  const users = storage.get(USERS, null);
  if (users) return users;
  const initial = [
    { id: 'u1', name: 'Demo Customer', email: 'demo@fitfuel.lk', password: 'demo1234', role: 'customer', points: 1450, joined: '2024-03-11' },
    { id: 'a1', name: 'Store Admin', email: 'admin@fitfuel.lk', password: 'admin1234', role: 'admin', points: 0, joined: '2023-11-02' }
  ];
  storage.set(USERS, initial);
  return initial;
};

const publicUser = ({ password, ...rest }) => rest;

export const authService = {
  getSession: () => storage.get(SESSION, null),

  async login(email, password) {
    try {
      // 1. Call Backend REST API for JWT Authentication
      const res = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });

      if (res.token) {
        localStorage.setItem(TOKEN_KEY, res.token);
      }
      storage.set(SESSION, res.user);
      return res.user;
    } catch (apiErr) {
      console.warn('[Auth Service] Backend offline or returned error, falling back to local simulation:', apiErr.message);
      const user = seed().find(
        (u) => u.email.toLowerCase() === String(email).toLowerCase().trim() && u.password === password
      );
      if (!user) return fail(apiErr.message || 'That email and password do not match an account.');
      storage.set(SESSION, publicUser(user));
      return ok(publicUser(user));
    }
  },

  async register({ name, email, password }) {
    try {
      // 1. Call Backend REST API to register with bcrypt & JWT
      const res = await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password })
      });

      if (res.token) {
        localStorage.setItem(TOKEN_KEY, res.token);
      }
      storage.set(SESSION, res.user);
      return res.user;
    } catch (apiErr) {
      console.warn('[Auth Service] Falling back to local registration:', apiErr.message);
      const users = seed();
      if (users.some((u) => u.email.toLowerCase() === String(email).toLowerCase().trim()))
        return fail('An account already exists for that email.');
      const user = {
        id: `u${Date.now().toString(36)}`,
        name, email: String(email).trim(), password,
        role: 'customer', points: 0,
        joined: new Date().toISOString().slice(0, 10)
      };
      users.push(user);
      storage.set(USERS, users);
      storage.set(SESSION, publicUser(user));
      return ok(publicUser(user));
    }
  },

  async requestReset(email) {
    try {
      const res = await apiRequest('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email })
      });
      return res;
    } catch {
      const exists = seed().some((u) => u.email.toLowerCase() === String(email).toLowerCase().trim());
      return exists
        ? ok({ sent: true })
        : fail('We could not find an account with that email.');
    }
  },

  async resetPassword(email, password, token) {
    try {
      const res = await apiRequest('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ email, password, token })
      });
      return res;
    } catch (err) {
      const users = seed();
      const i = users.findIndex((u) => u.email.toLowerCase() === String(email).toLowerCase().trim());
      if (i < 0) return fail(err.message || 'We could not find an account with that email.');
      users[i].password = password;
      storage.set(USERS, users);
      return ok({ reset: true });
    }
  },

  async updateProfile(id, patch) {
    try {
      const res = await apiRequest('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(patch)
      });
      if (res?.user) {
        storage.set(SESSION, res.user);
        return res.user;
      }
    } catch {
      // Local fallback
    }

    const users = seed();
    const i = users.findIndex((u) => u.id === id);
    if (i < 0) {
      // In case session exists with that id
      const session = storage.get(SESSION, null);
      if (session) {
        const updated = { ...session, ...patch };
        storage.set(SESSION, updated);
        return ok(updated);
      }
      return fail('Account not found.');
    }
    users[i] = { ...users[i], ...patch };
    storage.set(USERS, users);
    storage.set(SESSION, publicUser(users[i]));
    return ok(publicUser(users[i]));
  },

  addPoints(id, points) {
    const users = seed();
    const i = users.findIndex((u) => u.id === id);
    if (i < 0) return ok(null);
    users[i].points = (users[i].points || 0) + points;
    storage.set(USERS, users);
    const session = storage.get(SESSION, null);
    if (session?.id === id) storage.set(SESSION, { ...session, points: users[i].points });
    return ok(users[i].points);
  },

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    storage.remove(SESSION);
    return ok(true);
  },

  async listCustomers() {
    try {
      const res = await apiRequest('/auth/users');
      if (res?.data && res.data.length > 0) {
        return res.data;
      }
    } catch {
      // Local fallback
    }
    return ok(seed().filter((u) => u.role === 'customer').map(publicUser));
  }
};
