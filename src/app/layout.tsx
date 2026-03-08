import type { Metadata } from "next";

import { globalMetadata } from "@/lib/seo/metadata";

import "./globals.css";

export const metadata: Metadata = globalMetadata;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
