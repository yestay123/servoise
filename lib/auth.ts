/**
 * Authentication utilities
 */

export interface User {
  id: number;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role?: string;
  is_active: boolean;
  is_verified: boolean;
}

export const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
};

export const setToken = (token: string): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem("access_token", token);
  }
};

export const removeToken = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("access_token");
  }
};

export const isAuthenticated = (): boolean => {
  return getToken() !== null;
};
