"use client";

import { Accordion } from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import useSidebarStore from "@/stores/SidebarStore";
import { useClerk } from "@clerk/nextjs";
import {
  ClipboardList,
  House,
  LogOut,
  Mailbox,
  Ticket,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { toast } from "sonner";

const userLink = [
  {
    name: "Dashboard",
    url: "/dashboard",
    Icon: House,
    public: true,
  },
  {
    name: "Accounts",
    url: "/accounts",
    Icon: Users,
    public: true,
  },
  {
    name: "Projects",
    url: "/projects",
    Icon: ClipboardList,
    public: true,
  },
  {
    name: "Daily Reports",
    url: "/daily-reports",
    Icon: Mailbox,
    public: true,
  },
  {
    name: "Tickets",
    url: "/tickets",
    Icon: Ticket,
    public: true,
  },
];

export default function Sidebar() {
  const { signOut } = useClerk();
  const { isSidebarOpen, closeSidebar } = useSidebarStore();
  const pathname = usePathname();

  async function handleLogout() {
    signOut({ redirectUrl: "/login" });
    toast.success("Log Out Successfull!");
  }

  return (
    <>
      <aside
        className={cn(
          "box-shadow bg-primary fixed z-50 min-h-screen w-[280px] space-y-3 overflow-hidden px-4 py-7 shadow-sm transition-all duration-500",
          isSidebarOpen ? "translate-x-0" : "max-lg:-translate-x-full",
        )}
      >
        <div className="flex w-full items-center gap-4 px-5 pb-1">
          {/* <Link href={"/"} className="relative flex size-24 items-center gap-4">
            <Image
              src="/images/logo.png"
              alt="Logo"
              className="object-contain object-center"
              fill
            />
          </Link> */}
          <Link
            href={"/"}
            className="flex w-full items-center justify-center gap-2"
          >
            <p className="text-secondary text-xl font-bold lg:text-2xl">
              TAM &
            </p>

            <p className="text-secondary text-xl font-bold lg:text-2xl">
              INTEGRA
            </p>
          </Link>

          <X
            onClick={closeSidebar}
            className="text-primary lg:hidden"
            size={32}
            strokeWidth={1.8}
          />
        </div>

        <Separator className="bg-secondary" />

        <ScrollArea className="h-[85vh] text-slate-100">
          <Accordion type="single" className="flex flex-col gap-2" collapsible>
            {userLink.map((item) => {
              return (
                <div key={item.url}>
                  <Link
                    onClick={closeSidebar}
                    key={item.url}
                    href={item.url}
                    className={cn(
                      "text-secondary mt-1 flex w-full items-center justify-between rounded-lg px-5 py-2.5 duration-300",
                      item.url !== "/" && pathname.startsWith(item.url)
                        ? "bg-secondary text-primary shadow-sm"
                        : "hover:bg-secondary/50 hover:text-secondary",
                    )}
                  >
                    <div className="flex items-center justify-center gap-5">
                      <item.Icon strokeWidth={1.8} size={24} />
                      <div className="text-xl">{item.name}</div>
                    </div>
                  </Link>
                </div>
              );
            })}
            <Separator className="bg-secondary" />
            <div
              className={cn(
                "text-secondary mt-1 flex h-full w-full cursor-pointer items-center px-5 py-2.5 duration-300",
              )}
            >
              <div
                onClick={handleLogout}
                className={`"justify-center flex cursor-pointer items-center gap-5`}
              >
                <LogOut strokeWidth={1.8} size={24} />
                <div className="text-xl">Log Out</div>
              </div>
            </div>
          </Accordion>
        </ScrollArea>
      </aside>
    </>
  );
}
