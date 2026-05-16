import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type AuthUser = {
  uid: string;
  email: string;
  displayName: string | null;
};

const STORAGE_KEY = "meetingsense.memberPortal.demoUser";

function normalizeEmail(email: string) {
  return email.toLowerCase().trim();
}

function createDemoUser(email: string, name?: string): AuthUser {
  const normalizedEmail = normalizeEmail(email);
  const displayName = (name || "").trim() || normalizedEmail.split("@")[0] || "Member";
  const uidBase = typeof btoa === "function" ? btoa(normalizedEmail) : normalizedEmail;
  const uid = `demo_${uidBase.replace(/=+$/g, "")}`;
  return { uid, email: normalizedEmail, displayName };
}

function readStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<AuthUser> | null;
    if (!parsed || typeof parsed.email !== "string") return null;
    return {
      uid: typeof parsed.uid === "string" ? parsed.uid : `demo_${Date.now()}`,
      email: normalizeEmail(parsed.email),
      displayName: typeof parsed.displayName === "string" ? parsed.displayName : null,
    };
  } catch {
    return null;
  }
}

function writeStoredUser(user: AuthUser | null) {
  try {
    if (!user) {
      localStorage.removeItem(STORAGE_KEY);
      return;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } catch {
    // Ignore storage errors in demo mode
  }
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUser(readStoredUser());
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    void password;
    const demoUser = createDemoUser(email);
    setUser(demoUser);
    writeStoredUser(demoUser);
  };

  const signup = async (email: string, password: string, name: string) => {
    void password;
    const demoUser = createDemoUser(email, name);
    setUser(demoUser);
    writeStoredUser(demoUser);
  };

  const logout = async () => {
    setUser(null);
    writeStoredUser(null);
  };

  const resetPassword = async (email: string) => {
    void email;
    // Demo-only: no backend reset email
  };

  const value = useMemo<AuthContextType>(
    () => ({ user, loading, login, signup, logout, resetPassword }),
    [user, loading]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
