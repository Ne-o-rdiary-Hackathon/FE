import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import type { ReactNode } from "react";

import { Providers } from "./providers";
import "./globals.css";

const pretendard = localFont({
  src: "../assets/fonts/PretendardVariable.woff2",
  variable: "--font-pretendard",
  weight: "45 920",
  display: "swap",
});

export const metadata: Metadata = {
  title: "칸칸",
  description: "Nordinary Project",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#ffffff",
};

interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <html lang="ko" className={pretendard.variable} suppressHydrationWarning>
      <body
        className="font-pretendard bg-bg-gray flex min-h-screen justify-center"
        suppressHydrationWarning
      >
        <Providers>
          <div className="bg-bg-normal flex min-h-screen w-full max-w-md flex-col">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;
