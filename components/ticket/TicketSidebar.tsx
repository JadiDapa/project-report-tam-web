"use client";

import { ArrowDownUpIcon, Search, Ticket } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Input } from "../ui/input";
import { getTicketsByRequesterId } from "@/lib/networks/ticket";
import { useQuery } from "@tanstack/react-query";
import { useAccount } from "@/providers/AccountProvider";
import Link from "next/link";
import { format, isToday, isYesterday } from "date-fns";
import { useState } from "react";

export const ticketStatus = [
  {
    status: "open",
    color: "#a9a9a9",
  },
  {
    status: "processed",
    color: "#ffaa00",
  },
  {
    status: "completed",
    color: "#00aa00",
  },
];

export const priorityStatus = [
  {
    priority: "low",
    color: "#00aa00",
  },
  {
    priority: "medium",
    color: "#ffaa00",
  },
  {
    priority: "high",
    color: "#ff0000",
  },
];

export function TicketSidebar() {
  const [searchTerm, setSearchTerm] = useState("");

  const { account } = useAccount();

  const { data: tickets } = useQuery({
    queryFn: () => getTicketsByRequesterId(String(account?.id)),
    queryKey: ["tickets", account?.id],
    enabled: !!account,
  });

  const filteredTickets =
    tickets?.filter((ticket) => {
      const latestMessage =
        ticket.TicketMessages?.[ticket.TicketMessages.length - 1]?.content ||
        "";

      const keyword = searchTerm.toLowerCase();
      return (
        ticket.title.toLowerCase().includes(keyword) ||
        ticket.code.toLowerCase().includes(keyword) ||
        latestMessage.toLowerCase().includes(keyword)
      );
    }) ?? [];

  return (
    <Sidebar>
      <SidebarContent className="bg-white p-6">
        <SidebarGroup className="space-y-2">
          <SidebarGroupLabel className="px-0 text-lg text-black">
            Your Tickets
          </SidebarGroupLabel>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search
                size={18}
                className="text-text-400 absolute top-1/2 left-3 -translate-y-1/2"
              />
              <Input
                placeholder={"Search..."}
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="border-primary/60 grid size-9 place-items-center rounded-md border">
              <ArrowDownUpIcon
                className="text-primary/60 size-5"
                strokeWidth={1.5}
              />
            </div>
          </div>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-3">
              {filteredTickets?.map((ticket) => {
                const currentStatus = ticketStatus.find(
                  (st) =>
                    st.status.toLowerCase() === ticket.status?.toLowerCase(),
                );

                const currentPriority = priorityStatus.find(
                  (st) =>
                    st.priority.toLowerCase() ===
                    ticket.priority?.toLowerCase(),
                );

                const lastMessage =
                  ticket.TicketMessages?.[ticket.TicketMessages.length - 1];
                const lastMessageDate = lastMessage?.createdAt
                  ? new Date(lastMessage.createdAt)
                  : null;

                const timeDisplay = lastMessageDate
                  ? isToday(lastMessageDate)
                    ? format(lastMessageDate, "HH:mm")
                    : isYesterday(lastMessageDate)
                      ? "Yesterday"
                      : format(lastMessageDate, "dd MMM")
                  : "New";

                return (
                  <SidebarMenuItem key={ticket.title}>
                    <SidebarMenuButton asChild>
                      <Link
                        href={`/your-ticket/${ticket.id}`}
                        className="flex h-40 w-full flex-col justify-normal rounded-lg border-2 border-slate-200 bg-white"
                      >
                        <div className="flex h-full w-full flex-col justify-between p-4 py-5">
                          <div className="">
                            <div className="flex items-center justify-between">
                              <div className="flex flex-row items-center gap-2">
                                <Ticket color="#4268ff" size={16} />
                                <p className="text-primary-500">
                                  {ticket.code}
                                </p>
                              </div>
                              <p className="text-sm text-slate-600">
                                {timeDisplay}
                              </p>
                            </div>
                            <p className="mt-1 line-clamp-2 font-semibold text-slate-700">
                              {ticket.title}
                            </p>
                            <p className="mt-2 text-sm text-slate-400">
                              {lastMessage?.content}
                            </p>
                          </div>

                          <div className="mt-3 flex flex-row items-center gap-2">
                            <div
                              className="w-20 overflow-hidden rounded-full px-1 py-0.5 text-xs"
                              style={{ backgroundColor: currentStatus?.color }}
                            >
                              <p className="text-center text-xs font-medium text-white capitalize">
                                {currentStatus?.status}
                              </p>
                            </div>
                            <div
                              className="w-20 overflow-hidden rounded-full border px-1 py-0.5 text-xs"
                              style={{
                                borderColor: currentPriority?.color,
                              }}
                            >
                              <p
                                className="text-center text-xs font-medium capitalize"
                                style={{
                                  color: currentPriority?.color,
                                }}
                              >
                                {currentPriority?.priority}
                              </p>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
