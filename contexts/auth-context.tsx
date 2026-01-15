"use client";

import React, { createContext, useContext, useEffect, useState, useRef } from "react";
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
  const refreshInProgress = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const login = (token: string, userData: User) => {
    setToken(token);
    setUser(userData);
    setLoading(false); // Set loading to false when user is logged in
  };

  const logout = () => {
    // Cancel any pending refresh
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    refreshInProgress.current = false;
    removeToken();
    setUser(null);
    router.push("/sign-in");
  };

  const refreshUser = async () => {
    // Prevent multiple simultaneous calls
    if (refreshInProgress.current) {
      return;
    }

    const token = getToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      refreshInProgress.current = false;
      return;
    }

    // If user is already set and we're not loading, don't refresh
    if (user && !loading) {
      return;
    }

    // Mark as in progress
    refreshInProgress.current = true;
    
    // Cancel any previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Create new abort controller
    abortControllerRef.current = new AbortController();

    setLoading(true);
    try {
      const response = await apiClient.getCurrentUser(abortControllerRef.current.signal);
      
      // Check if request was aborted
      if (abortControllerRef.current?.signal.aborted) {
        return;
      }

      if (response.data) {
        setUser(response.data);
      } else {
        // Token is invalid
        removeToken();
        setUser(null);
      }
    } catch (error) {
      // Ignore abort errors
      if (error instanceof Error && error.name === 'AbortError') {
        return;
      }
      
      // Check if request was aborted
      if (abortControllerRef.current?.signal.aborted) {
        return;
      }

      console.error("Error refreshing user:", error);
      removeToken();
      setUser(null);
    } finally {
      // Only update loading state if not aborted
      if (!abortControllerRef.current?.signal.aborted) {
        setLoading(false);
      }
      refreshInProgress.current = false;
      abortControllerRef.current = null;
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

    // Cleanup on unmount
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
      refreshInProgress.current = false;
    };
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
