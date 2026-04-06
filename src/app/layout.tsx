import type { Metadata } from "next";
import { Heebo } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const heebo = Heebo({
  variable: "--font-heebo",
  subsets: ["latin", "hebrew"],
});

export const metadata: Metadata = {
  title: "מונדיאל 2026 - טורניר ניחושים",
  description: "טורניר ניחושי מונדיאל 2026 - נחשו תוצאות, צברו נקודות, זכו בפרסים!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl" className={`${heebo.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-[family-name:var(--font-heebo)]">
        <TooltipProvider>
          {children}
          <Toaster position="top-center" dir="rtl" />
        </TooltipProvider>
      </body>
    </html>
  );
}
