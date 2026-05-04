import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "../styles/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Strata",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <nav className="flex items-center gap-6 px-8 py-4 border-b border-neutral-800">
          <span className="text-lg font-bold">Strata</span>
          <Link href="/" className="text-neutral-400 hover:text-white">Dashboard</Link>
          <Link href="/chat" className="text-neutral-400 hover:text-white">Chat</Link>
        </nav>
        {children}
      </body>
    </html>
  );
}