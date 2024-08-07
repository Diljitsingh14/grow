import { SessionProvider } from "next-auth/react";
import { AppProps } from "next/app";
import { Session } from "@/types/session";
import { Inter } from "next/font/google";

import "../styles/globals.css";
import "swiper/swiper-bundle.css";
import "react-big-calendar/lib/css/react-big-calendar.css";

const inter = Inter({ subsets: ["latin"] });

interface MyAppProps extends AppProps {
  pageProps: {
    session: Session;
    [key: string]: any; // Allow any other additional props
  };
}

const MyApp: React.FC<MyAppProps> = ({ Component, pageProps }) => {
  return (
    <div className={inter.className}>
      <SessionProvider session={pageProps.session}>
        <Component {...pageProps} />
      </SessionProvider>
    </div>
  );
};

export default MyApp;
