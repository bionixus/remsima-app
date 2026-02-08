import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';

// Standard next-intl usage doesn't strictly require routing.ts if middleware handles it.
// I'll stick to basic implementation first.

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hikma Remsima",
  description: "Medication tracker for Remsima SC by Hikma Pharmaceuticals",
};

import { MobileShell } from "@/components/layout/MobileShell";
import { PageTransition } from "@/components/layout/PageTransition";

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Validate that the incoming `locale` parameter is valid
  if (!['en', 'ar', 'hi'].includes(locale)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  const direction = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={direction} className="antialiased">
      <body
        className={`${geistSans.variable} ${geistMono.variable}`}
      >
        <NextIntlClientProvider messages={messages} locale={locale}>
          <MobileShell locale={locale}>
            <PageTransition>
              {children}
            </PageTransition>
          </MobileShell>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
