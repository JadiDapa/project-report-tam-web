"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  ReactNode,
} from "react";
import { useUser } from "@clerk/nextjs";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { AccountType } from "@/lib/types/account";
import { getAccountByEmail } from "@/lib/networks/account";

interface AccountContextType {
  account?: AccountType | null;
  loading: boolean;
  refetch: () => void;
}

const AccountContext = createContext<AccountContextType | null>(null);

export function AccountProvider({ children }: { children: ReactNode }) {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  const userEmail = user?.primaryEmailAddress?.emailAddress ?? "";
  const isLoginPage = pathname === "/login" || pathname === "/sign-in";

  const isRootPage = pathname === "/";

  useEffect(() => {
    if (isLoaded && !user && !isLoginPage && !isRootPage) {
      router.push("/login");
    }
  }, [isLoaded, user, isLoginPage, isRootPage, router]);

  // Skip query if not logged in
  const {
    data: account,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["account", userEmail],
    queryFn: () => getAccountByEmail(userEmail),
    enabled: !!userEmail,
  });

  // Load from localStorage first
  useEffect(() => {
    if (userEmail) {
      const saved = localStorage.getItem("account");
      if (saved) {
        queryClient.setQueryData(["account", userEmail], JSON.parse(saved));
      }
    }
  }, [userEmail, queryClient]);

  // Save to localStorage
  useEffect(() => {
    if (account) {
      localStorage.setItem("account", JSON.stringify(account));
    }
  }, [account]);

  const value = useMemo(
    () => ({
      account,
      loading: isLoading,
      refetch,
    }),
    [account, isLoading, refetch],
  );

  if (!isLoaded) return <div>Loading...</div>; // Spinner placeholder
  if (!user && !isLoginPage && !isRootPage) return null;
  // Wait for redirect

  return (
    <AccountContext.Provider value={value}>{children}</AccountContext.Provider>
  );
}

export function useAccount(): AccountContextType {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error("useAccount must be used within an AccountProvider");
  }
  return context;
}
