import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Launchyard",
  description: "Deploy your projects with Launchyard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}