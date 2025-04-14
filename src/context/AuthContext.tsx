"use client";
import React, { createContext, useState, useContext, useEffect } from "react";
import { checkAuth } from "./actions";
import { useRouter } from "@/i18n/routing";

interface AuthContextType {
  isLoading: boolean;
  isAuthenticated: boolean;
  setIsLoading: (isLoading: boolean) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  checkAuthStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  const checkAuthStatus = async () => {
    setIsLoading(true);
    try {
      const { isAuthenticated: authStatus } = await checkAuth();
      setIsAuthenticated(authStatus);
      
      if (typeof window !== 'undefined') {
        const pathname = window.location.pathname;
        if (authStatus && (pathname === "/login" || pathname === "/register")) {
          router.push("/");
        } else if (!authStatus && pathname === "/") {
          router.push("/login");
        }
      }
    } catch (error) {
      console.error("Auth check failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        checkAuthStatus,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};