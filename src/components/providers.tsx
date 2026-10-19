'use client';

import { SessionProvider } from 'next-auth/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { ThemeProvider } from './providers/theme-provider';
import { Toaster } from 'react-hot-toast';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Extended cache times for low bandwidth
            staleTime: 10 * 60 * 1000, // 10 minutes - data stays fresh longer
            gcTime: 60 * 60 * 1000, // 60 minutes - keep in cache much longer
            refetchOnWindowFocus: false,
            refetchOnMount: false, // Don't refetch if data exists
            refetchOnReconnect: false, // Don't auto-refetch on reconnect
            retry: 2, // Retry twice on failure (for slow connections)
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000), // Exponential backoff
            networkMode: 'offlineFirst', // Use cache first, critical for slow networks
          },
          mutations: {
            retry: 2,
            retryDelay: 1000,
            networkMode: 'offlineFirst',
          },
        },
      })
  );

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SessionProvider 
        refetchOnWindowFocus={false} 
        refetchInterval={0}
        refetchWhenOffline={false}
      >
        <QueryClientProvider client={queryClient}>
          {children}
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3000,
              className:
                '!bg-card !text-card-foreground !border !border-border !rounded-xl !shadow-xl !text-sm !font-medium',
              success: { iconTheme: { primary: 'hsl(142 76% 46%)', secondary: '#fff' } },
              error: { iconTheme: { primary: 'hsl(0 84% 60%)', secondary: '#fff' } },
            }}
          />
        </QueryClientProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}
