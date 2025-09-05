import { createTRPCClient as createBaseTRPCClient, httpBatchLink } from '@trpc/client';
import { createTRPCReact } from '@trpc/react-query';
import superjson from 'superjson';
import { ENV } from './env';

// Import the AppRouter type from the backend
import type { AppRouter } from '../../../../vibe/src/trpc/routers/_app';

// Create TRPC React hooks
export const trpc = createTRPCReact<AppRouter>();

// Get the API URL from environment variables
const API_URL = ENV.API_URL;

// Create TRPC client with auth (following the working expo project pattern)
export function createTRPCClient(getToken: () => Promise<string | null>) {
  return createBaseTRPCClient<AppRouter>({
    links: [
      httpBatchLink({
        transformer: superjson,
        url: `${API_URL}/api/trpc`,
        headers: async () => {
          try {
            const token = await getToken();
            console.log('Using auth token for tRPC:', token ? 'Yes' : 'No');
            return {
              authorization: token ? `Bearer ${token}` : '',
            };
          } catch (error) {
            console.error('Error getting auth token:', error);
            return {};
          }
        },
      }),
    ],
  });
}

// Default client for initial setup
export const trpcClient = createBaseTRPCClient<AppRouter>({
  transformer: superjson,
  links: [
    httpBatchLink({
      url: `${API_URL}/api/trpc`,
    }),
  ],
});
