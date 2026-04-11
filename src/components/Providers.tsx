'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';

interface ProvidersProps {
  children: React.ReactNode;
  initialLocale: string;
  initialMessages: any;
}

export default function Providers({ children, initialLocale, initialMessages }: ProvidersProps) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  }));

  const { settings, setMessages, loadMessages } = useAppStore();
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize store with server-provided messages
  useEffect(() => {
    if (settings.locale === initialLocale) {
      setMessages(initialMessages);
    } else {
      // If server-rendered locale doesn't match client preference (from localStorage), 
      // we must fetch the correct messages to avoid showing the wrong language.
      loadMessages(settings.locale);
    }
    setIsInitialized(true);
  }, [initialLocale, initialMessages, settings.locale, setMessages, loadMessages]);

  return (
    <QueryClientProvider client={queryClient}>
      {/* 
        Prevent flickering of untranslated keys by ensuring messages are loaded.
        Since we hydrate from SSR, initialMessages will be available immediately on mount.
      */}
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
