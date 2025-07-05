"use client";

import {
  ClipboardList,
  GripVertical,
  Info,
  Plus,
  UsersRound,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
// import LayoutSwitch from "@/components/root/LayoutSwitch";
// import DataTable from "@/components/root/DataTable";
import ExcelExport from "@/components/root/ExcelExport";
// import SearchDataTable from "@/components/root/SearchDataTable";
import { getAllProjects } from "@/lib/networks/project";
// import { projectColumn } from "@/lib/columns/project";
import CreateProjectModal from "@/components/root/project/CreateProjectModal";
import Link from "next/link";
import CircularProgress from "@/components/root/CircularProgress";
import { TaskEvidenceType } from "@/lib/types/task-evidence";
import { format } from "date-fns";

export const statuses = [
  {
    label: "Low",
    value: "low",
    bgColor: "bg-success-200 text-success-700 border-success-500",
    bg: "bg-success-500",
  },
  {
    label: "Medium",
    value: "medium",
    bgColor: "bg-warning-200 text-warning-700 border-warning-500",
    bg: "bg-warning-500",
  },
  {
    label: "High",
    value: "high",
    bgColor: "bg-error-200 text-error-700 border-error-500",
    bg: "bg-error-500",
  },
];

export default function ProjectsDashboard() {
  const { data: projects } = useQuery({
    queryFn: getAllProjects,
    queryKey: ["projects"],
  });

  const statistics = [
    {
      title: "All Projects",
      value: projects ? projects.length : 0,
      icon: ClipboardList,
      description: "All existing projects in TAM",
    },
    {
      title: "Running Projects",
      value:
        projects?.filter((project) => project.status !== "closed").length ?? 0,
      icon: ClipboardList,
      description: "All existing projects in TAM",
    },
    {
      title: "Closed Projects",
      value:
        projects?.filter((project) => project.status === "closed").length ?? 0,
      icon: ClipboardList,
      description: "All existing projects in TAM",
    },
    {
      title: "Latest Project",
      value: projects
        ? projects[projects.length - 1].title
        : "No Project Found",
      icon: ClipboardList,
      description: "All existing projects in TAM",
    },
  ];

  function globalPercentage(
    tasks: { TaskEvidences: TaskEvidenceType[]; quantity?: number }[],
  ) {
    if (!tasks || tasks.length === 0) return 0;

    const totalPercentage = tasks.reduce((sum, task) => {
      const filledEvidences = task.TaskEvidences.filter(
        (e) => e.TaskEvidenceImages.length > 0,
      ).length;
      const taskCompletion = Math.min(
        filledEvidences / (task.quantity ?? 1),
        1,
      ); // Cap at 100%
      return sum + taskCompletion;
    }, 0);

    const averagePercentage = (totalPercentage / tasks.length) * 100;
    return Math.round(averagePercentage);
  }

  if (projects) {
    return (
      <section className="flex w-full flex-col gap-4 py-6 lg:gap-6">
        {/* Header Title */}
        <div className="flex w-full flex-col justify-between gap-4 lg:flex-row lg:gap-6">
          <div className="">
            <h1 className="text-4xl font-medium">Projects</h1>
            <p className="hidden lg:inline">
              Taruna Anugrah Mandiri Project List
            </p>
          </div>
          <div className="flex items-center gap-4 lg:gap-6">
            {/* <LayoutSwitch /> */}
            <ExcelExport data={projects} filename="tam-projects.xlsx" />

            <CreateProjectModal>
              <div className="bg-primary text-secondary grid size-10 place-items-center gap-4 rounded-md text-lg shadow-sm">
                <Plus size={24} />
              </div>
            </CreateProjectModal>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          {statistics.map((stat) => (
            <div
              key={stat.title}
              className="flex justify-between gap-4 rounded-xl bg-white p-6 shadow-md"
            >
              <div className="flex flex-col justify-between gap-1">
                <div className="space-y-1">
                  <p className="text-muted-foreground">{stat.title}</p>
                  <p
                    className={`text-primary ${stat.title === "Latest Project" ? "line-clamp-2 text-lg font-medium" : "text-4xl font-semibold"}`}
                  >
                    {stat.value}
                  </p>
                </div>
                <p className="text-sm text-slate-400">{stat.description}</p>
              </div>
              <div className="">
                <div className="bg-primary text-secondary grid h-10 w-10 place-items-center rounded-md">
                  <stat.icon size={24} strokeWidth={1.8} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* <DataTable
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
        /> */}

        <div className="space-y-4">
          <div className="">
            <p className="text-2xl font-medium">Project List</p>
          </div>
          <div className="flex flex-col gap-4">
            {projects.map((project) => {
              const status = statuses.find((s) => s.value === project.status);
              return (
                <Link
                  href={`/projects/${project.id}`}
                  key={project.id}
                  className="group flex flex-col justify-between rounded-xl bg-white px-6 py-5 shadow-lg transition-all duration-200 hover:opacity-80 hover:shadow-2xl md:flex-row md:items-center"
                >
                  {/* Left: Project Info */}
                  <div className="flex items-center gap-4 md:flex-1">
                    <GripVertical className="size-8 shrink-0 text-slate-400" />
                    <div>
                      <h2 className="group-hover:text-primary text-lg font-semibold text-slate-800">
                        {project.title}
                      </h2>
                      <p className="mt-1 text-sm text-slate-500">
                        Created:{" "}
                        {format(new Date(project.createdAt), "dd MMMM yyyy")}
                      </p>
                    </div>
                  </div>

                  {/* Right: Status, Employees, Progress */}
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-8 md:mt-0 md:w-auto md:justify-end">
                    {/* Status */}
                    <div className="flex items-center gap-2">
                      <Info className="size-4 text-slate-600" />
                      <p
                        className={`font-semibold capitalize ${status?.bgColor}`}
                      >
                        {status?.label}
                      </p>
                    </div>

                    {/* Employees */}
                    <div className="flex items-center gap-2">
                      <UsersRound className="size-4 text-slate-600" />
                      <span className="font-semibold text-slate-700">
                        {project.Employees.length} Employees
                      </span>
                    </div>

                    {/* Progress */}
                    <CircularProgress
                      percentage={globalPercentage(project.Tasks)}
                      size={64}
                      strokeWidth={6}
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    );
  }
}
