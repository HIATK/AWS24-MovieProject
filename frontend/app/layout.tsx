import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import dynamic from "next/dynamic";
import { AuthProvider } from "./(context)/AuthContext";
import {ThemeProvider} from "@/(components)/theme-provider";
import React from "react";

const inter = Inter({ subsets: ["latin"] });

const Sidebar = dynamic(() => import('./(components)/Sidebar/Sidebar'), { ssr: false });

export const metadata: Metadata = {
  title: "MovieProject",
  description: "Movie",
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {/* 레이아웃에 적용할 내용을 입력 */}
        <AuthProvider>
          <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange>
            {children}
          </ThemeProvider>
          <Sidebar />
          {modal}
        </AuthProvider>
      </body>
    </html>
  );
}
