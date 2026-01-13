"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api";
import { getToken, removeToken, setToken } from "@/lib/auth";
import type { User } from "@/lib/auth";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const login = (token: string, userData: User) => {
    setToken(token);
    setUser(userData);
    setLoading(false); // Set loading to false when user is logged in
  };

  const logout = () => {
    removeToken();
    setUser(null);
    router.push("/sign-in");
  };

  const refreshUser = async () => {
    const token = getToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    // If user is already set, don't refresh
    if (user) {
      setLoading(false);
      return;
    }

    // Prevent multiple simultaneous calls
    if (loading) {
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.getCurrentUser();
      if (response.data) {
        setUser(response.data);
      } else {
        // Token is invalid
        removeToken();
        setUser(null);
      }
    } catch (error) {
      console.error("Error refreshing user:", error);
      removeToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check authentication status on mount
    const checkAuth = async () => {
      const token = getToken();
      if (!token) {
        // No token, user is not authenticated
        setUser(null);
        setLoading(false);
        return;
      }
      
      // If we have a token, fetch user data
      await refreshUser();
    };
    
    checkAuth();
    // Only run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
