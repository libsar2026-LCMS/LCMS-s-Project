import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair", weight: ["700", "800"] });

export const metadata: Metadata = {
  title: {
    default: "LCMS — LIBSAR Community Management System",
    template: "%s | LCMS",
  },
  description: "Liberians in Rwanda — United, Empowered, Thriving",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} font-sans bg-background text-text-primary antialiased`}>
        {children}
      </body>
    </html>
  );
}
