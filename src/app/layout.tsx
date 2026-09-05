import type { Metadata } from "next";
import type { ReactNode } from "react";

import { globalMetadata } from "@/site/seo/metadata";

import "./globals.css";

export const metadata: Metadata = globalMetadata;

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
