"use client";

import { useQuery } from "@tanstack/react-query";
import LayoutSwitch from "@/components/root/LayoutSwitch";
import DataTable from "@/components/root/DataTable";
import ExcelExport from "@/components/root/ExcelExport";
import SearchDataTable from "@/components/root/SearchDataTable";
import { getProjectsByAccountId } from "@/lib/networks/project";
import { projectColumn } from "@/lib/columns/project";
import { useAccount } from "@/providers/AccountProvider";

export default function ProjectsDashboard() {
  const { account } = useAccount();

  const { data: projects } = useQuery({
    queryFn: () => getProjectsByAccountId(String(account?.id ?? "")),
    queryKey: ["projects", account?.id],
  });

  if (projects) {
    return (
      <section className="flex w-full flex-col gap-4 py-6 lg:gap-6">
        {/* Header Title */}
        <div className="flex w-full flex-col justify-between gap-4 lg:flex-row lg:gap-6">
          <div className="">
            <h1 className="text-4xl font-medium">My Projects</h1>
            <p className="hidden lg:inline">
              These are the projects you are currently working on with Taruna
              Anugrah Mandiri.
            </p>
          </div>
          <div className="flex items-center gap-4 lg:gap-6">
            <LayoutSwitch />
            <ExcelExport data={projects} filename="tam-projects.xlsx" />
          </div>
        </div>

        <DataTable
          columns={projectColumn}
          data={projects}
          filters={(table) => (
            <div className="grid gap-4 p-4 lg:grid-cols-4 lg:gap-6">
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
