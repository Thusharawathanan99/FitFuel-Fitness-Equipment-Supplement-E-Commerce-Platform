import { ok, fail } from './http';
import { storage } from '../utils/storage';

/**
 * Mock authentication. Accounts live in localStorage; there is no token and no server.
 * Replace the bodies with real API calls and the rest of the app keeps working —
 * every consumer only awaits these promises.
 */
const USERS = 'users';
const SESSION = 'session';
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

  login(email, password) {
    const user = seed().find(
      (u) => u.email.toLowerCase() === String(email).toLowerCase().trim() && u.password === password
    );
    if (!user) return fail('That email and password do not match an account.');
    storage.set(SESSION, publicUser(user));
    return ok(publicUser(user));
  },

  register({ name, email, password }) {
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
  },

  requestReset(email) {
    const exists = seed().some((u) => u.email.toLowerCase() === String(email).toLowerCase().trim());
    return exists
      ? ok({ sent: true })
      : fail('We could not find an account with that email.');
  },

  resetPassword(email, password) {
    const users = seed();
    const i = users.findIndex((u) => u.email.toLowerCase() === String(email).toLowerCase().trim());
    if (i < 0) return fail('We could not find an account with that email.');
    users[i].password = password;
    storage.set(USERS, users);
    return ok({ reset: true });
  },

  updateProfile(id, patch) {
    const users = seed();
    const i = users.findIndex((u) => u.id === id);
    if (i < 0) return fail('Account not found.');
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
    storage.remove(SESSION);
    return ok(true);
  },

  listCustomers: () => ok(seed().filter((u) => u.role === 'customer').map(publicUser))
};
