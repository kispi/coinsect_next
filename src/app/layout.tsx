import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import fs from 'fs'
import path from 'path'
import { cookies } from 'next/headers'
import Providers from '@/components/Providers'
import AppHeader from '@/components/app/app-header/AppHeader'
import ThemeHandler from '@/components/ThemeHandler'
import UIRoot from '@/components/ui/UIRoot'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Coinsect - Next.js Migration',
  description: 'Migrating Vue 3 to Next.js',
}

interface RootLayoutProps {
  children: React.ReactNode
}

// Simple server-side message loader for SSR
function getServerMessages(locale: string) {
  try {
    const filePath = path.join(process.cwd(), 'public', 'locales', `${locale}.json`)
    const content = fs.readFileSync(filePath, 'utf8')
    return JSON.parse(content)
  } catch (e) {
    console.error(`Failed to load server messages for ${locale}`, e)
    return {}
  }
}

export default async function RootLayout({ children }: RootLayoutProps) {
  // Read locale from cookie for SSR, fallback to 'ko'
  const cookieStore = await cookies()
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'ko'
  const messages = getServerMessages(locale)

  return (
    <html lang={locale} className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased min-h-screen bg-background text-text-base">
        <Providers initialLocale={locale} initialMessages={messages}>
          <ThemeHandler />
          <UIRoot />
          <AppHeader />
          <main className="mx-auto max-w-7xl pt-4">{children}</main>
        </Providers>
      </body>
    </html>
  )
}
