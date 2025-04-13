"use client";

import { QueryClient, QueryClientProvider } from "react-query";
import { AuthProvider } from "../context/AuthContext";

import React from "react";

const Providers = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient();

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </AuthProvider>
  );
};

export default Providers;
