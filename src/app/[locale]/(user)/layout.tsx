"use client";

import Navbar from "../../../../components/navbar";
import React, { useEffect } from "react";
import { useRouter } from "../../../../i18n/routing";
import { useAuth } from "../../../../context/AuthContext";

const UserLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated ) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  return (
    <>
      <Navbar />
    </>
  );
};

export default UserLayout;
