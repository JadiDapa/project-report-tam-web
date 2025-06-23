"use client";

import { TicketSidebar } from "@/components/ticket/TicketSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};
export default function RootLayout({ children }: Props) {
  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "24rem",
        "--sidebar-width-mobile": "24rem",
      }}
    >
      <TicketSidebar />
      <main className="w-full">{children}</main>
    </SidebarProvider>
  );
}
