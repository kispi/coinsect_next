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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,        // Always treat data as stale → refetch on every mount
      gcTime: 60 * 1000,   // Keep data in cache 60s so HydrationBoundary survives React render cycle
      refetchOnWindowFocus: false,
    },
  },
});

export default function Providers({ children, initialLocale, initialMessages }: ProvidersProps) {


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

  // If BFCache restores the page (event.persisted === true), Next.js modules may
  // re-evaluate resetting module-level state. We force fresh data and messages.
  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        queryClient.invalidateQueries();
        loadMessages(settings.locale);
      }
    };
    window.addEventListener('pageshow', handlePageShow);
    return () => window.removeEventListener('pageshow', handlePageShow);
  }, [settings.locale, loadMessages]);

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
