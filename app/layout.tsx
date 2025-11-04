import { Analytics } from "@/components/analytics";
import type { Metadata, Viewport } from "next";
import type React from "react";
import ClientLayout from "./client";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Uday Raj Vadeghar | Software Engineer",
  description:
    "Portfolio of Uday Raj Vadeghar — Software Engineer specializing in Java, JavaScript, TypeScript, React.js, Node.js, and Cloud technologies.",
  keywords: [
    "Uday Raj Vadeghar",
    "Software Engineer",
    "Full Stack Developer",
    "JavaScript",
    "TypeScript",
    "React",
    "Node.js",
    "AWS",
  ],
  authors: [{ name: "Uday Raj Vadeghar" }],
  creator: "Uday Raj Vadeghar",
  icons: {
    icon: [
      { url: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>💼</text></svg>", type: "image/svg+xml" },
    ],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://udayrajvadeghar.com",
    title: "Uday Raj Vadeghar | Software Engineer",
    description:
      "Portfolio of Uday Raj Vadeghar, a Software Engineer specializing in Java, JavaScript, TypeScript, React.js, Node.js, and Cloud technologies.",
    siteName: "Uday Raj Vadeghar Portfolio",
    images: [
      {
        url: "/next.svg",
        width: 512,
        height: 512,
        alt: "Next.js Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Uday Raj Vadeghar | Software Engineer",
    description: "Portfolio of Uday Raj Vadeghar — Software Engineer. ",
    creator: "@udayraj",
    images: ["/next.svg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body suppressHydrationWarning>
        <ClientLayout>{children}</ClientLayout>
        <Analytics />
      </body>
    </html>
  );
}
