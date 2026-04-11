'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState, useEffect, useRef } from 'react';
import { useAppStore } from '@/store/useAppStore';

interface ProvidersProps {
  children: React.ReactNode;
  initialLocale: string;
  initialMessages: any;
}

export default function Providers({ children, initialLocale, initialMessages }: ProvidersProps) {
  // Move QueryClient into useState to ensure it is bounded to React Component Lifecycle
  // on the client, preventing SSR cross-request leaks and Next.js HMR/chunk cache wipes.
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,  // Data remains fresh for 1 minute (prevents immediate re-fetching on back navigation)
        gcTime: 5 * 60 * 1000, // Keep data in cache 5mins (300000ms) matching Next.js router cache
        refetchOnWindowFocus: false,
      },
    },
  }));

  const { settings, loadMessages } = useAppStore();

  // Initialize store synchronously before children mount so translations don't flicker.
  // This helps when Next.js restores route cache via backward navigation.
  const isZustandHydrated = useRef(false);
  if (!isZustandHydrated.current) {
    const store = useAppStore.getState();
    const currentMessages = store.messages;
    
    // Populate immediately if empty
    if (Object.keys(currentMessages).length === 0) {
      if (store.settings.locale === initialLocale) {
        store.setMessages(initialMessages);
      } else {
        // If settings locale differs, trigger an async load
        store.loadMessages(store.settings.locale);
      }
    }
    isZustandHydrated.current = true;
  }

  // If BFCache restores the page (event.persisted === true)
  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        queryClient.invalidateQueries();
        loadMessages(settings.locale);
      }
    };
    window.addEventListener('pageshow', handlePageShow);
    return () => window.removeEventListener('pageshow', handlePageShow);
  }, [settings.locale, loadMessages, queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
