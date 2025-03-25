import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NavbarWrapper from "./components/NavbarWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VoiceCare EHR",
  description: "Voice-to-EHR Medical Record System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NavbarWrapper />
        {children}
      </body>
    </html>
  );
}
