import { getServerCookie } from "../../../features/actions";
import { redirect } from "next/navigation"; 
import React from "react";

const AuthLayout = async ({ children }: { children: React.ReactNode }) => {
  const isAuth = await getServerCookie("token");
  
  if (isAuth) {
    redirect("/"); 
  }
  return <>{children}</>;
};

export default AuthLayout;