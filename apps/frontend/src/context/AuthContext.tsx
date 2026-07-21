import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { api, setAccessToken } from '../services/api';

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'CUSTOMER';
};

type AuthResponse = {
  success: boolean;
  data: { user: AuthUser; accessToken: string };
  message: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    api
      .post<AuthResponse>('/auth/refresh')
      .then((response) => {
        if (!active) return;
        setAccessToken(response.data.data.accessToken);
        setUser(response.data.data.user);
      })
      .catch(() => {
        if (active) {
          setUser(null);
        }
      })
      .finally(() => {
        if (active) {
          setIsLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, []);

  async function login(email: string, password: string) {
    const response = await api.post<AuthResponse>('/auth/login', { email, password });
    setAccessToken(response.data.data.accessToken);
    setUser(response.data.data.user);
  }

  async function register(name: string, email: string, password: string) {
    const response = await api.post<AuthResponse>('/auth/register', {
      name,
      email,
      password,
    });
    setAccessToken(response.data.data.accessToken);
    setUser(response.data.data.user);
  }

  async function logout() {
    await api.post('/auth/logout').catch(() => undefined);
    setAccessToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit etre utilise dans un AuthProvider');
  }
  return context;
}
