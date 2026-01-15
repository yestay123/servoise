/**
 * API Client for backend communication
 */

// Production: https://api.servoise.com
// Development: http://localhost:8000
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers,
        signal: options.signal, // Support abort signals
      });

      // Check if request was aborted
      if (options.signal?.aborted) {
        return { error: "Request aborted" };
      }

      if (!response.ok) {
        const error = await response.json().catch(() => ({
          detail: response.statusText,
        }));
        return { error: error.detail || "An error occurred" };
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      // Don't treat abort errors as real errors
      if (error instanceof Error && error.name === 'AbortError') {
        return { error: "Request aborted" };
      }
      
      return {
        error: error instanceof Error ? error.message : "Network error",
      };
    }
  }

  private getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("access_token");
  }

  setToken(token: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("access_token", token);
    }
  }

  removeToken(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token");
    }
  }

  // Auth endpoints
  async getGoogleAuthUrl() {
    return this.request<{ authorization_url: string; state: string }>(
      "/api/v1/auth/google"
    );
  }

  async register(data: {
    email: string;
    first_name: string;
    last_name: string;
    password: string;
    password_confirm: string;
    role: "agentuser" | "agentcreator" | "admin";
  }) {
    return this.request<{
      access_token: string;
      token_type: string;
      user: {
        id: number;
        email: string;
        full_name: string | null;
        avatar_url: string | null;
        role: string;
        is_active: boolean;
        is_verified: boolean;
      };
    }>("/api/v1/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async signIn(data: { email: string; password: string }) {
    return this.request<{
      access_token: string;
      token_type: string;
      user: {
        id: number;
        email: string;
        full_name: string | null;
        avatar_url: string | null;
        role: string;
        is_active: boolean;
        is_verified: boolean;
      };
    }>("/api/v1/auth/signin", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getCurrentUser(signal?: AbortSignal) {
    return this.request<{
      id: number;
      email: string;
      full_name: string | null;
      avatar_url: string | null;
      role: string;
      is_active: boolean;
      is_verified: boolean;
    }>("/api/v1/auth/me", {
      signal,
    });
  }

  // Health check
  async healthCheck() {
    return this.request<{ status: string; version: string }>("/health");
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
