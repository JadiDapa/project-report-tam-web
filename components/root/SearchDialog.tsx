"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Link from "next/link";
import { SetStateAction, useState } from "react";

export default function SearchDialog() {
  const [search, setSearch] = useState("");
  const [pages] = useState([
    {
      name: "Dashboard",
      url: "/dashboard",
      adminOnly: false,
    },
    {
      name: "My Requests",
      url: "/my-requests",
      adminOnly: false,
    },
    {
      name: "All Requests",
      url: "/requests",
      adminOnly: true,
    },
    {
      name: "User List",
      url: "/users",
      adminOnly: true,
    },
    {
      name: "All Entries",
      url: "/entries",
      adminOnly: true,
    },
    {
      name: "All Consumes",
      url: "/consumes",
      adminOnly: true,
    },
    {
      name: "Inventories",
      url: "/inventories",
      adminOnly: true,
    },
    {
      name: "All Items",
      url: "/items",
      adminOnly: true,
    },
  ]);

  const handleChange = (e: { target: { value: SetStateAction<string> } }) => {
    setSearch(e.target.value);
  };

  const filteredPages = pages.filter((page) => {
    const matchesSearch = page.name
      .toLowerCase()
      .includes(search.toLowerCase());
    // const isAllowed = page.adminOnly ? userRole === "admin" : true;
    return matchesSearch;
  });

  return (
    <div className="border-secondary flex items-center gap-4 rounded-lg lg:h-[40px] lg:w-80 lg:border lg:px-2">
      <div className="items-center justify-center rounded-full duration-300 hover:bg-gray-200">
        <Search strokeWidth={1.5} size={24} className="text-secondary" />
      </div>
      <Dialog>
        <DialogTrigger className="text-secondary hidden w-full text-start lg:block">
          Search
        </DialogTrigger>
        <DialogContent className="flex flex-col px-0 pt-4 pb-0 lg:w-[660px]">
          <div className="relative w-80 pl-8">
            <DialogTitle>
              <Search className="absolute top-1.5 left-10 text-sm text-slate-400" />
            </DialogTitle>
            <Input
              type="text"
              placeholder="Search a page"
              value={search}
              onChange={handleChange}
              className="text-secondary placeholder:text-secondary pl-10"
            />
          </div>
          <hr />
          <div className="flex h-72 flex-col overflow-y-scroll px-8 py-4">
            {filteredPages.map((section) => (
              <DialogClose key={section.name}>
                <Link
                  href={section.url}
                  className="group pt-2 duration-300 hover:rounded-lg hover:bg-gray-100"
                >
                  <div className="flex flex-col items-start">
                    <div className="translate-x-2 font-semibold">
                      {section.name}
                    </div>
                    <div className="translate-x-2 text-sm text-slate-500">
                      {section.url}
                    </div>
                  </div>
                  <hr className="mt-2 group-hover:opacity-0" />
                </Link>
              </DialogClose>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
