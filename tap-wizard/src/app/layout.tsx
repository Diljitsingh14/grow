import { Session } from "@/types/session";
import { Inter } from "next/font/google";
import { getServerSession } from "next-auth";
import { NextAuthSessionProvider } from "@/utils/next-auth-session-provider";
import { CartProvider } from "@/utils/cart-provider";
import { authOptions } from "@/utils/next-auth-session-provider/auth";
import HeaderWrapper from "@/views/Header/HeaderWrapper";
import Footer from "@/views/Footer";

import "../styles/globals.css";
import "swiper/swiper-bundle.css";
import "react-big-calendar/lib/css/react-big-calendar.css";

const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout(
  { children }: { children: React.ReactNode }
) {
  const session: Session | null = await getServerSession(authOptions);
  return (
    <html lang="en">
      <body>
        <div className={inter.className}>
          <NextAuthSessionProvider session={session}>
            <CartProvider>
              <HeaderWrapper />
              {children}
              <Footer />
            </CartProvider>
          </NextAuthSessionProvider>
        </div>
      </body>
    </html>
  );
}