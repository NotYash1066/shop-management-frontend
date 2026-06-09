"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";

import type { AuthSession, Authority } from "@/lib/types";

const STORAGE_KEY = "shop-management-session";

type AuthContextValue = {
  session: AuthSession | null;
  hydrated: boolean;
  setSession: (nextSession: AuthSession | null) => void;
  logout: () => void;
  hasAuthority: (authority: Authority) => boolean;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSessionState] = useState<AuthSession | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setSessionState(JSON.parse(stored) as AuthSession);
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }
    setHydrated(true);
  }, []);

  const setSession = (nextSession: AuthSession | null) => {
    setSessionState(nextSession);
    if (nextSession) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSession));
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      hydrated,
      setSession,
      logout: () => setSession(null),
      hasAuthority: (authority) => Boolean(session?.authorities.includes(authority))
    }),
    [hydrated, session]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
