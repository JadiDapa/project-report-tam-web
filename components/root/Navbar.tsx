"use client";

import { LogOut, Menu, Paperclip } from "lucide-react";
import SearchDialog from "./SearchDialog";
import Image from "next/image";
import useSidebarStore from "@/stores/SidebarStore";
import Notifications from "./Notifications";
import { useAccount } from "@/providers/AccountProvider";
import { toast } from "sonner";
import { useClerk } from "@clerk/nextjs";

export default function Navbar() {
  const { openSidebar } = useSidebarStore();
  const { account } = useAccount();
  const { signOut } = useClerk();

  async function handleLogout() {
    signOut({ redirectUrl: "/login" });
    toast.success("Log Out Successfull!");
  }

  return (
    <div className="bg-primary flex w-full flex-row items-center justify-between gap-4 px-4 py-2 lg:gap-6 lg:px-6 lg:py-4">
      <div className="flex items-center gap-6">
        <Menu
          strokeWidth={1.5}
          size={28}
          onClick={openSidebar}
          className="text-white lg:hidden"
        />
        <SearchDialog />
      </div>
      <div className="flex items-center gap-6">
        <Notifications />
        <Paperclip strokeWidth={1.8} size={24} className="text-secondary" />
        <LogOut
          onClick={handleLogout}
          strokeWidth={1.8}
          size={24}
          className="text-secondary"
        />

        <div className="bg-secondary h-10 w-[1px]" />
        <div className="flex items-center gap-6">
          <figure className="border-secondary relative size-[40px] overflow-hidden rounded-full border-2">
            <Image
              src={
                account?.image ||
                "https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg"
              }
              alt="Logo"
              fill
              className="object-cover object-center"
            />
          </figure>
          <div className="hidden lg:block">
            <p className="text-secondary font-medium">{account?.fullname}</p>
            <p className="text-secondary text-sm font-semibold">
              {account?.Role.name}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
