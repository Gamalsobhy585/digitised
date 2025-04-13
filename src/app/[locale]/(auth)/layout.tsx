import { getServerCookie } from "../../../../features/actions";
import { redirect } from "../../../../i18n/routing";
import React from "react";

const AuthLayout = async ({ children }: { children: React.ReactNode }) => {
  const isAuth = await getServerCookie("token");
  const locale = await getServerCookie("NEXT_LOCALE") ?? "ar";
  
  

  if (isAuth) {
    redirect({ locale, href: "/" });
  }



  return <>{children}</>;
};

export default AuthLayout;