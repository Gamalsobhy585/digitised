import type { Metadata } from "next";
import "../globals.css";
import { Cairo } from "next/font/google";
import Providers from "../../components/providers";
import { ToastContainer } from "react-toastify";
import { UserProvider } from "@/app/contexts/user-conetxt";

import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "../../i18n/routing";
import AuthWrapper from "../../components/auth-wrapper";

const cairo = Cairo({
  subsets: ["latin"],
  weight: ["400", "700", "500", "600"],
});

export const metadata: Metadata = {
  title: "Digitised",
  description:
    "Digitised is a test assessment for digitised company.",
};

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <body className={`antialiased ${cairo.className}`}>
        <div className="App">
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            closeOnClick={true}
            pauseOnHover={true}
            draggable={false}
            toastStyle={{
              width: "300px",
              fontSize: "14px",
              borderRadius: "8px",
            }}
          />
        </div>
        <NextIntlClientProvider messages={messages}>
          <Providers>
            <AuthWrapper>
              <UserProvider>{children}</UserProvider>
            </AuthWrapper>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
