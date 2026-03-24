import { createContext, useContext, useState, type ReactNode } from 'react';
import { api } from '../lib/api';

interface Admin {
  id: string;
  email: string;
}

interface AuthContextType {
  token: string | null;
  admin: Admin | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem('cgg_admin_token')
  );
  const [admin, setAdmin] = useState<Admin | null>(null);

  const login = async (email: string, password: string) => {
    const data = await api.post<{ token: string; admin: Admin }>('/auth/login', {
      email,
      password,
    });
    localStorage.setItem('cgg_admin_token', data.token);
    setToken(data.token);
    setAdmin(data.admin);
  };

  const logout = () => {
    localStorage.removeItem('cgg_admin_token');
    setToken(null);
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ token, admin, isAuthenticated: !!token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
