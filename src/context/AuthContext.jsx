import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { authService } from '../services';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setUser(authService.getSession());
    setReady(true);
  }, []);

  const login = useCallback(async (email, password) => {
    const u = await authService.login(email, password);
    setUser(u);
    return u;
  }, []);

  const register = useCallback(async (payload) => {
    const u = await authService.register(payload);
    setUser(u);
    return u;
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  const updateProfile = useCallback(async (patch) => {
    if (!user) return null;
    const u = await authService.updateProfile(user.id, patch);
    setUser(u);
    return u;
  }, [user]);

  const awardPoints = useCallback(async (points) => {
    if (!user) return;
    const total = await authService.addPoints(user.id, points);
    setUser((u) => (u ? { ...u, points: total } : u));
  }, [user]);

  const value = useMemo(
    () => ({
      user, ready,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin',
      login, register, logout, updateProfile, awardPoints
    }),
    [user, ready, login, register, logout, updateProfile, awardPoints]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
