import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "House of Lune",
  description: "A premium digital maison for contemporary high jewelry.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
