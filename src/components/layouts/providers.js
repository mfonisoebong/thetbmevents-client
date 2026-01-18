"use client"
import { QueryCache, QueryClient, QueryClientProvider } from 'react-query';
import { useRouter } from 'next/navigation';
import {deleteCookie} from "../../lib/utils";

export default function Providers({ children }) {
  const router = useRouter()

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        // refetchOnWindowFocus: false,
        refetchOnReconnect: false,
      }
    },
    queryCache: new QueryCache({
      onError: (error, query) => {
        // Global error handling for queries
        // console.error(`Something went wrong: ${error}`);
        // You can add custom logic here, like showing a toast notification
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          // redirect to login
          deleteCookie('token');
          router.push('/');
          // window.location.href = '/';
        }
      },
    }),
  });

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

