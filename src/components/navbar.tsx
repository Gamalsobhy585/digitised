"use client";

import { Link } from "../i18n/routing";
import Image from "next/image";


import { useAuth } from "../context/AuthContext";
import { Task } from "../features/types";
import SearchBar from "../features/user/components/search-bar";
import { Badge } from "./ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";

const Navbar = () => {
  const { isAuthenticated } = useAuth();


  const t = useTranslations("user.nav");



  const showNotAuthMsg = () => {
    return toast.info(t("shouldLogin"), {
      theme: "colored",
    });
  };
  return (
    <>
      <nav className="flex justify-between items-center py-2 px-3 sm:px-6 md:px-12">
        <Link href="/">
          <Image
            src="/logo.webp"
            alt="logo"
            width={50}
            height={50}
            quality={100}
            priority
          />
        </Link>
        <SearchBar />
      
      </nav>
    
    </>
  );
};

export default Navbar;
