"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiClient } from "@/lib/api";
import { useAuth } from "@/components/auth-provider";

export default function CallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const hasProcessed = useRef(false);

  useEffect(() => {
    // Prevent multiple executions
    if (hasProcessed.current) {
      return;
    }

    // Get params once
    const token = searchParams.get("token");
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    
    // Mark as processed immediately to prevent re-execution
    hasProcessed.current = true;

    // If token is already in URL (from backend redirect), use it directly
    if (token) {
      setIsProcessing(true);
      
      try {
        // Decode token to get user info, or fetch user data
        apiClient.setToken(token);
        
        // Fetch user data from backend
        apiClient.getCurrentUser().then((response) => {
          if (response.data) {
            login(token, response.data);
            // Use replace instead of push to avoid adding to history
            router.replace("/agents");
          } else {
            setError("Failed to fetch user data");
            setTimeout(() => router.replace("/sign-in"), 3000);
          }
          setIsProcessing(false);
        }).catch((err) => {
          console.error("Error fetching user:", err);
          setError("Failed to authenticate");
          setTimeout(() => router.replace("/sign-in"), 3000);
          setIsProcessing(false);
        });
      } catch (err) {
        console.error("Auth callback error:", err);
        setError("Invalid token");
        setTimeout(() => router.replace("/sign-in"), 3000);
        setIsProcessing(false);
      }
      return;
    }

    // If no token but we have code, call backend callback
    if (!code) {
      setError("Authorization code not found");
      setTimeout(() => router.replace("/sign-in"), 3000);
      return;
    }

    setIsProcessing(true);

    const handleCallback = async () => {
      try {
        // Call backend callback endpoint to exchange code for token
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        const response = await fetch(
          `${apiUrl}/api/v1/auth/google/callback?code=${encodeURIComponent(code)}${state ? `&state=${encodeURIComponent(state)}` : ""}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            redirect: "follow", // Follow redirects
          }
        );

        // If response is a redirect, the browser will handle it
        // Otherwise, try to parse JSON
        if (response.redirected) {
          // Already redirected, this shouldn't happen in fetch
          setIsProcessing(false);
          return;
        }

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({
            detail: "Authentication failed",
          }));
          throw new Error(errorData.detail || "Authentication failed");
        }

        const data = await response.json();

        if (data.access_token && data.user) {
          // Store token and user data
          apiClient.setToken(data.access_token);
          login(data.access_token, data.user);

          // Redirect to agents page
          router.replace("/agents");
        } else {
          throw new Error("Invalid response from server");
        }
        setIsProcessing(false);
      } catch (err) {
        console.error("Auth callback error:", err);
        setError(
          err instanceof Error ? err.message : "An error occurred during authentication"
        );
        setTimeout(() => router.replace("/sign-in"), 3000);
        setIsProcessing(false);
      }
    };

    handleCallback();
  }, [searchParams, router, login]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-2">Authentication Error</h1>
          <p className="text-muted-foreground mb-4">{error}</p>
          <p className="text-sm text-muted-foreground">
            Redirecting to sign in page...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Completing authentication...</p>
      </div>
    </div>
  );
}
