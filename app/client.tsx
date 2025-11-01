"use client";

import AnimatedBackground from "@/components/animated-background";
import Footer from "@/components/footer";
import Header from "@/components/header";
import NoScriptStyles from "@/components/noscript-styles";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { Inter as FontSans } from "next/font/google";
import type React from "react";
import "./globals.css";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NoScriptStyles />
      <style jsx global>{`
        :root {
          --font-mono: "Geist Mono", ui-monospace, SFMono-Regular, "Roboto Mono",
            Menlo, Monaco, "Liberation Mono", "DejaVu Sans Mono", "Courier New",
            monospace, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
        }

        body {
          font-family: var(--font-mono);
        }
      `}</style>
      <div
        className={cn(
          "min-h-screen bg-background font-mono antialiased",
          fontSans.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={true}
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col overflow-hidden">
            <noscript>
              <div className="bg-yellow-100 dark:bg-yellow-900 p-4 text-center text-sm">
                For the best experience, please enable JavaScript. Some features
                may be limited without it.
              </div>
            </noscript>
            <AnimatedBackground />
            <Header />
            <main className="flex-1 relative z-10">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </div>
    </>
  );
}
