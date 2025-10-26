import { Analytics } from "@/components/analytics";
import type { Metadata } from "next";
import type React from "react";
import ClientLayout from "./client";

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
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-touch-icon.png" }],
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
        url: "/favicon.png",
        width: 512,
        height: 512,
        alt: "Uday Raj Vadeghar Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Uday Raj Vadeghar | Software Engineer",
    description:
      "Portfolio of Uday Raj Vadeghar — Software Engineer. ",
    creator: "@udayraj",
    images: ["/favicon.png"],
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
