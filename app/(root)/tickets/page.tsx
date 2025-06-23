"use client";

import { Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import LayoutSwitch from "@/components/root/LayoutSwitch";
import DataTable from "@/components/root/DataTable";
import ExcelExport from "@/components/root/ExcelExport";
import SearchDataTable from "@/components/root/SearchDataTable";
import { getAllTickets } from "@/lib/networks/ticket";
import { ticketColumn } from "@/lib/columns/ticket";
import { format } from "date-fns";

export default function TicketDashboard() {
  const { data: tickets } = useQuery({
    queryFn: getAllTickets,
    queryKey: ["tickets"],
  });

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
            <h1 className="text-4xl font-medium">Ticket List</h1>
            <p className="hidden lg:inline">
              Taruna Anugrah Mandiri Ticket List
            </p>
          </div>
          <div className="flex items-center gap-4 lg:gap-6">
            <LayoutSwitch />
            <ExcelExport
              data={excelData ?? []}
              filename={`tam-tickets-${format(new Date(), "dd-MMMM-yyyy")}.xlsx`}
            />

            <Link href="/activities/create">
              <div className="bg-primary text-secondary grid size-10 place-items-center gap-4 rounded-md text-lg shadow-sm">
                <Plus size={24} />
              </div>
            </Link>
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
