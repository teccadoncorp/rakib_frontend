"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { api, type User } from "./api";
import { isStaffRole, normalizeRole } from "./roles";

type AuthContextValue = {
  user: User | null;
  token: string | null;
  ready: boolean;
  login: (loginInput: string, password: string) => Promise<User>;
  register: (payload: Record<string, string>) => Promise<User>;
  adminLogin: (username: string, password: string) => Promise<User>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function shapeUser(user: User): User {
  return { ...user, role: normalizeRole(user.role) as User["role"] };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("ds_token");
    if (!stored) {
      setReady(true);
      return;
    }
    setToken(stored);
    api
      .me(stored)
      .then((res) => setUser(shapeUser(res.user)))
      .catch(() => {
        localStorage.removeItem("ds_token");
        setToken(null);
      })
      .finally(() => setReady(true));
  }, []);

  const persist = (nextToken: string, nextUser: User) => {
    const shaped = shapeUser(nextUser);
    localStorage.setItem("ds_token", nextToken);
    setToken(nextToken);
    setUser(shaped);
    return shaped;
  };

  const login = useCallback(async (loginInput: string, password: string) => {
    const res = await api.login(loginInput, password);
    return persist(res.token, res.user);
  }, []);

  const register = useCallback(async (payload: Record<string, string>) => {
    const res = await api.register(payload);
    return persist(res.token, res.user);
  }, []);

  const adminLogin = useCallback(async (username: string, password: string) => {
    const res = await api.staffLogin(username, password);
    if (!isStaffRole(res.user.role)) {
      throw new Error("This account cannot open the staff portal.");
    }
    return persist(res.token, res.user);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("ds_token");
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, token, ready, login, register, adminLogin, logout }),
    [user, token, ready, login, register, adminLogin, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
