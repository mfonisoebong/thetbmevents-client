import AlertProvider from "@common/contexts/Alert/Provider";
import "../styles/globals.css";
import "../styles/fonts.css";
import Layout from "@common/components/Layout";
import { queryClient } from "@config/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <AlertProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </AlertProvider>
    </QueryClientProvider>
  );
}
