'use client';

import { useEffect, useState } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { useAppStore } from '@/store/useAppStore';

interface Props {
  children: React.ReactNode;
  initialLocale: string;
  initialMessages: any;
}

export default function DynamicI18nProvider({
  children,
  initialLocale,
  initialMessages,
}: Props) {
  const locale = useAppStore((state) => state.settings.locale);
  const [messages, setMessages] = useState(initialMessages);
  const [activeLocale, setActiveLocale] = useState(initialLocale);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const loadMessages = async () => {
      // If the locale from store (potentially from localStorage) is different from current active locale
      if (locale === activeLocale) return;

      try {
        const response = await fetch(`/locales/${locale}.json`);
        if (!response.ok) throw new Error('Failed to fetch messages');
        const data = await response.json();
        setMessages(data);
        setActiveLocale(locale);
      } catch (error) {
        console.error('Error loading locale messages:', error);
      }
    };

    loadMessages();
  }, [locale, isMounted, activeLocale]);

  return (
    <NextIntlClientProvider locale={activeLocale} messages={messages} timeZone="Asia/Seoul">
      {children}
    </NextIntlClientProvider>
  );
}
