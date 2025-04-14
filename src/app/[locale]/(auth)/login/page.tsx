"use client";

import { LoginForm } from "../../../../features/auth/login/login-form";
import Image from "next/image";

function Login() {
  return (
    <main className="relative h-screen w-full bg-primary flex justify-center items-center px-6 md:px-12">
      <Image
        src="/bg.png"
        alt="bg"
        width={1000}
        height={1000}
        className="absolute h-full w-full object-cover"
      />
      <LoginForm className="z-10" />
    </main>
  );
}

export default Login;
