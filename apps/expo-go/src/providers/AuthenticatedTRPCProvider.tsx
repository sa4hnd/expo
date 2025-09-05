import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { trpc, createTRPCClient } from '../config/trpc';
import { useAuth } from '@clerk/clerk-expo';

interface AuthenticatedTRPCProviderProps {
  children: React.ReactNode;
}

// Create query client (following the working expo project pattern)
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30 * 1000,
        retry: 3,
      },
      mutations: {
        retry: 1,
      },
    },
  });
}

export const AuthenticatedTRPCProvider: React.FC<AuthenticatedTRPCProviderProps> = ({ children }) => {
  const { getToken } = useAuth();
  const [queryClient] = useState(() => makeQueryClient());
  const [trpcClient] = useState(() => createTRPCClient(getToken));

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </trpc.Provider>
  );
};
