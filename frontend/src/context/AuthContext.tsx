import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import { authApi } from "../services/api";
import type { AuthResponse, UserRole } from "../types";

interface AuthContextValue {
  token: string | null;
  username: string | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem("optical-ai-token"));
  const [username, setUsername] = useState<string | null>(localStorage.getItem("optical-ai-username"));
  const [role, setRole] = useState<UserRole | null>((localStorage.getItem("optical-ai-role") as UserRole | null) ?? null);

  useEffect(() => {
    if (!token) {
      localStorage.removeItem("optical-ai-token");
      localStorage.removeItem("optical-ai-username");
      localStorage.removeItem("optical-ai-role");
      return;
    }
    localStorage.setItem("optical-ai-token", token);
    if (username) {
      localStorage.setItem("optical-ai-username", username);
    }
    if (role) {
      localStorage.setItem("optical-ai-role", role);
    }
  }, [role, token, username]);

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      username,
      role,
      isAuthenticated: Boolean(token),
      login: async (usernameInput: string, password: string) => {
        const response: AuthResponse = await authApi.login(usernameInput, password);
        setToken(response.access_token);
        setUsername(response.username);
        setRole(response.role);
      },
      logout: () => {
        setToken(null);
        setUsername(null);
        setRole(null);
      }
    }),
    [role, token, username]
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
