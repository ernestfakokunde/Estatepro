import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EstatePro | Find your place",
  description: "Discover homes and properties with EstatePro.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
