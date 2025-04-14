"use client";
import Spinner from "../components/spinner";
import { useAuth } from "../context/AuthContext";
import React from "react";

const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const { isLoading } = useAuth();

  if (isLoading) return <Spinner className="default-spinner-class" />;

  return <>{children}</>;
};

export default AuthWrapper;
