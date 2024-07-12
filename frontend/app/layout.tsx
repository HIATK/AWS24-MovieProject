import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import dynamic from "next/dynamic";
import { AuthProvider } from "./(context)/AuthContext";
import React from "react";
import {ThemeProvider} from "@/(components)/DarkModToggle/ThemeContext";

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
      <ThemeProvider>
        <AuthProvider>
          {children}
        <Sidebar />
          {modal}
        </AuthProvider>
      </ThemeProvider>
      </body>
    </html>
  );
}
