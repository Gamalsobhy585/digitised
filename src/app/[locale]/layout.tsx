import type { Metadata } from "next";
import "../globals.css";
import { Cairo } from "next/font/google";
import Providers from "../../components/providers";
import { ToastContainer } from "react-toastify";
import { UserProvider } from "@/app/contexts/user-conetxt";
import AuthWrapper from "../../components/auth-wrapper";

const cairo = Cairo({
  subsets: ["latin"],
  weight: ["400", "700", "500", "600"],
});

export const metadata: Metadata = {
  title: "Digitised",
  description: "Digitised is a test assessment for digitised company.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
  return (
    <html lang="en"> 
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
        <Providers>
          <AuthWrapper>
            <UserProvider>{children}</UserProvider>
          </AuthWrapper>
        </Providers>
      </body>
    </html>
  );
}