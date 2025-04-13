import type { Metadata } from "next";
import "../globals.css";
import { Cairo } from "next/font/google";
import Providers from "../../../components/providers";
import { ToastContainer } from "react-toastify";
import { UserProvider } from "@/app/contexts/user-conetxt";

import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "../../../i18n/routing";
import AuthWrapper from "../../../components/auth-wrapper";

const cairo = Cairo({
  subsets: ["latin"],
  weight: ["400", "700", "500", "600"],
});

export const metadata: Metadata = {
  title: "Spider",
  description:
    "Spider is a premier e-commerce platform offering a wide range of products from various merchants. Discover unique styles and high-quality items tailored to your needs.",
};

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
