import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sign in with Apple",
  description: "Apple OAuth Demo",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}