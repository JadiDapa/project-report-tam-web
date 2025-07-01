"use client";

import { useQuery } from "@tanstack/react-query";
import DataTable from "@/components/root/DataTable";
import ExcelExport from "@/components/root/ExcelExport";
import SearchDataTable from "@/components/root/SearchDataTable";
import { getTicketsByHandlerId } from "@/lib/networks/ticket";
import { ticketColumn } from "@/lib/columns/ticket";
import { format } from "date-fns";
import { useAccount } from "@/providers/AccountProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function TicketDashboard() {
  const { account } = useAccount();
  const router = useRouter();

  const { data: tickets } = useQuery({
    queryFn: () => getTicketsByHandlerId(String(account?.id ?? "")),
    queryKey: ["tickets", account?.id],
  });

  useEffect(() => {
    if (!account) return;
    console.log(account);
    const isTicketManager = account?.Role?.Features?.some(
      (feature) => feature.name === "Manage Ticket",
    );

    if (!isTicketManager) {
      router.replace("/");
    }
  }, [account, router]);

  const excelData = tickets?.map((account, i) => ({
    No: i + 1,
    "Created At": format(account.createdAt, "dd MMMM, yyyy"),
    Requester: account.Requester.fullname,
    Handler: account.Handler?.fullname || "Unassigned",
    Title: account.title,
    Status: account.status,
    Priority: account.priority,
  }));

  if (tickets) {
    return (
      <section className="flex w-full flex-col gap-4 py-6 lg:gap-6">
        {/* Header Title */}
        <div className="flex w-full flex-col justify-between gap-4 lg:flex-row lg:gap-6">
          <div className="">
            <h1 className="text-4xl font-medium">My Assigned Ticket List</h1>
            <p className="hidden lg:inline">
              These are the tickets you are currently handling with Taruna
              Anugrah Mandiri.
            </p>
          </div>
          <div className="flex items-center gap-4 lg:gap-6">
            <ExcelExport
              data={excelData ?? []}
              filename={`tam-tickets-${format(new Date(), "dd-MMMM-yyyy")}.xlsx`}
            />
          </div>
        </div>

        <DataTable
          columns={ticketColumn}
          data={tickets}
          filters={(table) => (
            <div className="grid gap-4 p-4 lg:grid-cols-4 lg:gap-6">
              <SearchDataTable
                table={table}
                column="requester"
                placeholder="Search Requester..."
              />
              <SearchDataTable
                table={table}
                column="handler"
                placeholder="Search Handler..."
              />
              <SearchDataTable
                table={table}
                column="title"
                placeholder="Search Title..."
              />
              <SearchDataTable
                table={table}
                column="status"
                placeholder="Search Status..."
              />
            </div>
          )}
        />
      </section>
    );
  }
}
