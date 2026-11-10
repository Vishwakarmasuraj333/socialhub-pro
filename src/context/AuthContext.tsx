'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { UserSession, Role } from '@/types';
import { useToast } from './ToastContext';

interface AuthContextType {
  user: UserSession | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; requires2FA?: boolean; message?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  hasRole: (requiredRole: Role) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { success, error } = useToast();

  const refreshUser = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        error('Authentication Failed', data.message || 'Invalid credentials');
        return { success: false, message: data.message };
      }

      if (data.requires2FA) {
        return { success: true, requires2FA: true, message: data.message };
      }

      setUser(data.user);
      success('Welcome back!', `Signed in as ${data.user.name}`);
      return { success: true };
    } catch (err: any) {
      error('Sign In Error', err.message || 'Something went wrong');
      return { success: false, message: err.message };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      success('Signed Out', 'You have been successfully signed out.');
      router.push('/login');
    } catch (err) {
      router.push('/login');
    }
  };

  const hasRole = (requiredRole: Role): boolean => {
    if (!user) return false;
    const hierarchy: Record<Role, number> = {
      OWNER: 50,
      ADMIN: 40,
      MANAGER: 30,
      EDITOR: 20,
      ANALYST: 10,
    };
    return (hierarchy[user.role] || 0) >= (hierarchy[requiredRole] || 0);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

