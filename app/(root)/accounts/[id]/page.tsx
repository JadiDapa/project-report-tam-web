"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { getAccountById } from "@/lib/networks/account";
import DataTable from "@/components/root/DataTable";
import SearchDataTable from "@/components/root/SearchDataTable";
import { dailyReportColumn } from "@/lib/columns/daily-report";
import { getProjectsByAccountId } from "@/lib/networks/project";
import { getDailyReportsByAccountId } from "@/lib/networks/daily-report";
import { projectColumn } from "@/lib/columns/project";

export default function AccountDetail() {
  const { id } = useParams();

  const { data: account } = useQuery({
    queryFn: () => getAccountById(id as string),
    queryKey: ["accounts", id],
  });

  const { data: projects } = useQuery({
    queryFn: () => getProjectsByAccountId(id as string),
    queryKey: ["projects", id],
  });

  const { data: dailyReports } = useQuery({
    queryFn: () => getDailyReportsByAccountId(id as string),
    queryKey: ["dailyReports", id],
  });

  if (!account) return null;

  return (
    <section className="flex w-full flex-col gap-4 py-6 lg:gap-6">
      {/* Header Title */}
      <div className="flex w-full flex-col justify-between gap-4 lg:flex-row lg:gap-6">
        <div className="">
          <h1 className="text-4xl font-medium">User Detail</h1>
          <p className="hidden lg:inline">User: {account.fullname}</p>
        </div>
      </div>

      <DataTable
        columns={dailyReportColumn}
        data={dailyReports ?? []}
        title="User Daily Reports"
        filters={(table) => (
          <div className="grid gap-4 p-4 lg:grid-cols-4 lg:gap-6">
            <SearchDataTable
              table={table}
              column="title"
              placeholder="Search Item..."
            />
          </div>
        )}
      />

      <DataTable
        columns={projectColumn}
        data={projects ?? []}
        title="User Projects"
        filters={(table) => (
          <div className="grid gap-4 p-4 lg:grid-cols-4 lg:gap-6">
            <SearchDataTable
              table={table}
              column="title"
              placeholder="Search Item..."
            />
          </div>
        )}
      />
    </section>
  );
}
