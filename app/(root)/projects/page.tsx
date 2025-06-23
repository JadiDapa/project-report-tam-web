"use client";

import { Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import LayoutSwitch from "@/components/root/LayoutSwitch";
import DataTable from "@/components/root/DataTable";
import ExcelExport from "@/components/root/ExcelExport";
import SearchDataTable from "@/components/root/SearchDataTable";
import { getAllProjects } from "@/lib/networks/project";
import { projectColumn } from "@/lib/columns/project";
import CreateProjectModal from "@/components/root/project/CreateProjectModal";

export default function ProjectsDashboard() {
  const { data: projects } = useQuery({
    queryFn: getAllProjects,
    queryKey: ["projects"],
  });

  if (projects) {
    return (
      <section className="flex w-full flex-col gap-4 py-6 lg:gap-6">
        {/* Header Title */}
        <div className="flex w-full flex-col justify-between gap-4 lg:flex-row lg:gap-6">
          <div className="">
            <h1 className="text-4xl font-medium">Project List</h1>
            <p className="hidden lg:inline">
              Taruna Anugrah Mandiri Project List
            </p>
          </div>
          <div className="flex items-center gap-4 lg:gap-6">
            <LayoutSwitch />
            <ExcelExport data={projects} filename="tam-projects.xlsx" />

            <CreateProjectModal>
              <div className="bg-primary text-secondary grid size-10 place-items-center gap-4 rounded-md text-lg shadow-sm">
                <Plus size={24} />
              </div>
            </CreateProjectModal>
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
