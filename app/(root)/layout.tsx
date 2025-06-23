"use client";

import Navbar from "@/components/root/Navbar";
import Sidebar from "@/components/root/Sidebar";

import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};
export default function RootLayout({ children }: Props) {
  return (
    <section className="bg-primary/5 flex min-h-screen w-full overflow-hidden lg:gap-12">
      <div>
        <Sidebar />
      </div>

      <main className="w-full lg:ml-[233px]">
        <Navbar />
        <div className="px-6">{children}</div>
      </main>
    </section>
  );
}
