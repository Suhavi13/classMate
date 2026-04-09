import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import type { PropsWithChildren } from 'react';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { checkPassword, isValidEmail } from './validation';
import type { User } from './types';

const USERS_KEY = 'classmate_users_v1';
const SESSION_KEY = 'classmate_session_v1';

type AuthState = {
  user: User | null;
  loading: boolean;
};

type AuthActions = {
  signIn: (email: string, password: string) => Promise<{ ok: true } | { ok: false; message: string }>;
  signUp: (input: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => Promise<{ ok: true } | { ok: false; message: string }>;
  signOut: () => Promise<void>;
  updateName: (name: string) => Promise<{ ok: true } | { ok: false; message: string }>;
  setDarkMode: (enabled: boolean) => Promise<void>;
};

type AuthContextValue = {
  state: AuthState;
  actions: AuthActions;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function uid() {
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

async function digestPassword(password: string) {
  return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, password);
}

async function loadUsers(): Promise<User[]> {
  const raw = await AsyncStorage.getItem(USERS_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as User[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function saveUsers(users: User[]) {
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<AuthState>({ user: null, loading: true });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const sessionUserId = await AsyncStorage.getItem(SESSION_KEY);
        if (!sessionUserId) {
          if (!cancelled) setState({ user: null, loading: false });
          return;
        }
        const users = await loadUsers();
        const user = users.find((u) => u.id === sessionUserId) ?? null;
        if (!cancelled) setState({ user, loading: false });
      } catch {
        if (!cancelled) setState({ user: null, loading: false });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const signIn = useCallback<AuthActions['signIn']>(async (emailRaw, password) => {
    const email = emailRaw.trim().toLowerCase();
    if (!isValidEmail(email)) return { ok: false, message: 'Enter a valid email.' };
    const pw = checkPassword(password);
    if (!pw.ok) return { ok: false, message: pw.reason ?? 'Password is invalid.' };

    const users = await loadUsers();
    const user = users.find((u) => u.email === email);
    if (!user) return { ok: false, message: 'No account found for this email.' };

    const hash = await digestPassword(password);
    if (hash !== user.passwordHash) return { ok: false, message: 'Incorrect password.' };

    await AsyncStorage.setItem(SESSION_KEY, user.id);
    setState({ user, loading: false });
    return { ok: true };
  }, []);

  const signUp = useCallback<AuthActions['signUp']>(async ({ name, email: emailRaw, password, confirmPassword }) => {
    const email = emailRaw.trim().toLowerCase();
    const trimmedName = name.trim();
    if (trimmedName.length < 2) return { ok: false, message: 'Name must be at least 2 characters.' };
    if (!isValidEmail(email)) return { ok: false, message: 'Enter a valid email.' };

    const pw = checkPassword(password);
    if (!pw.ok) return { ok: false, message: pw.reason ?? 'Password is invalid.' };
    if (password !== confirmPassword) return { ok: false, message: 'Passwords do not match.' };

    const users = await loadUsers();
    if (users.some((u) => u.email === email)) return { ok: false, message: 'An account already exists for this email.' };

    const passwordHash = await digestPassword(password);
    const user: User = {
      id: uid(),
      email,
      passwordHash,
      name: trimmedName,
      darkMode: false,
      createdAt: Date.now(),
    };
    const nextUsers = [user, ...users];
    await saveUsers(nextUsers);
    await AsyncStorage.setItem(SESSION_KEY, user.id);
    setState({ user, loading: false });
    return { ok: true };
  }, []);

  const signOut = useCallback<AuthActions['signOut']>(async () => {
    await AsyncStorage.removeItem(SESSION_KEY);
    setState({ user: null, loading: false });
  }, []);

  const updateName = useCallback<AuthActions['updateName']>(
    async (nameRaw) => {
      const user = state.user;
      if (!user) return { ok: false, message: 'Not signed in.' };
      const name = nameRaw.trim();
      if (name.length < 2) return { ok: false, message: 'Name must be at least 2 characters.' };

      const users = await loadUsers();
      const nextUsers = users.map((u) => (u.id === user.id ? { ...u, name } : u));
      await saveUsers(nextUsers);

      const nextUser = { ...user, name };
      setState({ user: nextUser, loading: false });
      return { ok: true };
    },
    [state.user]
  );

  const setDarkMode = useCallback<AuthActions['setDarkMode']>(
    async (enabled) => {
      const user = state.user;
      if (!user) return;
      const users = await loadUsers();
      const nextUsers = users.map((u) => (u.id === user.id ? { ...u, darkMode: enabled } : u));
      await saveUsers(nextUsers);
      setState({ user: { ...user, darkMode: enabled }, loading: false });
    },
    [state.user]
  );

  const actions = useMemo<AuthActions>(
    () => ({ signIn, signUp, signOut, updateName, setDarkMode }),
    [setDarkMode, signIn, signOut, signUp, updateName]
  );

  const value = useMemo<AuthContextValue>(() => ({ state, actions }), [actions, state]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
