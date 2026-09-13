import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Prevents automatic refetching when window gains focus
      retry: 1,                    // Number of retries on request failure
      staleTime: 1000 * 60 * 5,    // Cache stays fresh for 5 minutes
    },
  },
});
