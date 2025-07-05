"use client";

import { useAccount } from "@/providers/AccountProvider";
import { redirect } from "next/navigation";

export default function DashboardPage() {
  const { account } = useAccount();
  console.log(account);
  redirect("/projects");
  return (
    <section className="min-h-screen w-full space-y-6 overflow-hidden">
      <div className="grid w-full grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-5"></div>
      <div className="flex flex-col gap-6 lg:h-96 lg:flex-row">
        <div className="bg-tertiary flex flex-[1] flex-col items-center gap-3 space-y-2 rounded-md p-6 shadow-md"></div>
      </div>
    </section>
  );
}
