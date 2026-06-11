import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Razorpay Smart Pages — AI-Powered Payment Pages",
  description:
    "Generate beautiful, conversion-optimized payment pages in under 2 minutes. No design or coding skills needed.",
  openGraph: {
    title: "Razorpay Smart Pages",
    description: "AI-powered landing pages + Razorpay checkout in one",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
