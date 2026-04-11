import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { getMessages, getLocale } from 'next-intl/server';
import Providers from '@/components/Providers';
import DynamicI18nProvider from '@/components/DynamicI18nProvider';
import AppHeader from '@/components/app/app-header/AppHeader';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Coinsect - Next.js Migration',
  description: 'Migrating Vue 3 to Next.js',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({
  children,
}: RootLayoutProps) {
  // Fetch initial locale and messages for SSR (defaults to 'ko' per request.ts)
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased min-h-screen bg-background text-text-base">
        <DynamicI18nProvider initialLocale={locale} initialMessages={messages}>
          <Providers>
            <AppHeader />
            <main className="mx-auto max-w-7xl pt-4">
              {children}
            </main>
          </Providers>
        </DynamicI18nProvider>
      </body>
    </html>
  );
}
