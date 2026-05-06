import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import { GlobalEffects } from "@/components/GlobalEffects";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "NEURO-FLOW OS | Personal Execution Control System",
  description: "High-performance cyberpunk execution dashboard. Track business, study, and tech progression.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="cyber-green">
      <body className={`${jetbrainsMono.className} crt-noise`}>
        <AppProvider>
          <GlobalEffects />
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
