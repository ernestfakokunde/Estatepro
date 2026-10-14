'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { apiFetch, jsonBody } from '@/lib/api';
import type { ApiUser } from '@/types/api';

type AuthContextValue = {
  user: ApiUser | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
  signIn: (values: { email: string; password: string }) => Promise<ApiUser>;
  signUp: (values: { name: string; email: string; password: string; phone?: string }) => Promise<ApiUser>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<ApiUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const result = await apiFetch<{ user: ApiUser }>('/auth/me');
      setUser(result.data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshUser();
  }, [refreshUser]);

  const signIn = useCallback(async (values: { email: string; password: string }) => {
    const result = await apiFetch<{ user: ApiUser }>('/auth/login', {
      method: 'POST',
      body: jsonBody(values),
    });
    setUser(result.data.user);
    return result.data.user;
  }, []);

  const signUp = useCallback(
    async (values: { name: string; email: string; password: string; phone?: string }) => {
      const result = await apiFetch<{ user: ApiUser }>('/auth/register', {
        method: 'POST',
        body: jsonBody(values),
      });
      setUser(result.data.user);
      return result.data.user;
    },
    [],
  );

  const signOut = useCallback(async () => {
    try {
      await apiFetch('/auth/logout', { method: 'POST' });
    } finally {
      setUser(null);
    }
  }, []);

  const value = useMemo(
    () => ({ user, loading, refreshUser, signIn, signUp, signOut }),
    [user, loading, refreshUser, signIn, signUp, signOut],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider.');
  return context;
}
