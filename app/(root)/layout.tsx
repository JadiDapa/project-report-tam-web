"use client";

import Navbar from "@/components/root/Navbar";
import Sidebar from "@/components/root/Sidebar";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

import { ReactNode, useEffect } from "react";

type Props = {
  children: ReactNode;
};
export default function RootLayout({ children }: Props) {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !user) {
      router.replace("/");
    }
  }, [isLoaded, user, router]);

  return (
    <section className="bg-primary/5 flex min-h-screen w-full overflow-hidden lg:gap-12">
      <div>
        <Sidebar />
      </div>

      <main className="w-full lg:ml-[233px]">
        <Navbar />
        <div className="px-4">{children}</div>
      </main>
    </section>
  );
}
