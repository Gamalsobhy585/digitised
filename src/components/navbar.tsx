"use client";

import { Link } from "../i18n/routing";
import Image from "next/image";


const Navbar = () => {

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
      </nav>
    </>
  );
};

export default Navbar;