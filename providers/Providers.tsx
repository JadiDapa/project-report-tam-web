"use client";

import { ReactNode, useState } from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import { AccountProvider } from "./AccountProvider";

interface Props {
  children: ReactNode;
}

export default function Providers({ children }: Props) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <ClerkProvider>
      <QueryClientProvider client={queryClient}>
        <AccountProvider>{children}</AccountProvider>
        <ProgressBar
          height="4px"
          color="#02343F"
          options={{ showSpinner: false }}
          shallowRouting
        />
      </QueryClientProvider>
    </ClerkProvider>
  );
}
