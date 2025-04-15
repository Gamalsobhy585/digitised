"use client";

import { useLogout } from "../features/auth/hooks/useAuth"; 
import { Link } from "../i18n/routing";
import Image from "next/image";
import { Button } from "./ui/button";

const Navbar = () => {
  const { logout, isLoggingOut } = useLogout(); 

  return (
    <nav className="flex justify-between items-center py-2 px-3 sm:px-6 md:px-12">
      <Link href="/">
        <Image
          src="/logo.png"
          alt="logo"
          width={50}
          height={50}
          quality={100}
          priority
        />
      </Link>
      <Button
      onClick={() => logout()}
      disabled={isLoggingOut}
        className="text-sm"
      >
        {isLoggingOut ? "Logging out..." : "Log out"}
      </Button>
    </nav>
  );
};

export default Navbar;
