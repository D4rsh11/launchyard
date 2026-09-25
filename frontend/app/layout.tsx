import type { Metadata } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

/* Display font - Fraunces (Tobias substitute)
   Weight 100 for the ultra-thin display style, with optical sizing */
const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-fraunces",
  display: "swap",
  preload: true,
});

/* Body font - Inter (ABC Diatype substitute) */
const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

/* Mono font - JetBrains Mono (ABC Diatype Mono substitute) */
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-jetbrains-mono",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "Launchyard - Deploy your code. Launch it into production.",
  description:
    "Launchyard is a container-based deployment platform that takes your code from repository to a running application without the infrastructure hassle.",
  icons: {
    icon: "/logo.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <body>
        {/* Speakeasy-style RGB gradient hairline at top */}
        <div className="ly-gradient-hairline" aria-hidden="true" />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}