"use client";

import {
  ClipboardCheck,
  ClipboardList,
  ClipboardX,
  Clock,
  GripVertical,
  Info,
  ListCheck,
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
import { useAccount } from "@/providers/AccountProvider";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

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
  const { account } = useAccount();
  const { data: projects } = useQuery({
    queryFn: getAllProjects,
    queryKey: ["projects"],
  });
  const router = useRouter();

  useEffect(() => {
    if (account && account.Role.name !== "Administrator") {
      router.replace("/my-projects");
    }
  }, [account, router]);

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
      icon: ClipboardCheck,
      description: "Projects that are currently active",
    },
    {
      title: "Closed Projects",
      value:
        projects?.filter((project) => project.status === "closed").length ?? 0,
      icon: ClipboardX,
      description: "Projects that completed or closed",
    },
    {
      title: "Latest Project",
      value: projects
        ? projects[projects.length - 1].title
        : "No Project Found",
      icon: Clock,
      description: "Most recently created project",
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
    return Number(averagePercentage.toFixed(1));
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

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-6">
          {statistics.map((stat) => (
            <div
              key={stat.title}
              className="flex justify-between gap-2 rounded-xl bg-white p-3 shadow-md lg:gap-4 lg:p-6"
            >
              <div className="flex flex-col justify-between gap-1">
                <div className="space-y-1">
                  <p className="text-muted-foreground text-sm">{stat.title}</p>
                  <p
                    className={`text-primary max-sm:w-24 ${stat.title === "Latest Project" ? "line-clamp-2 text-lg font-medium" : "text-4xl font-semibold"}`}
                  >
                    {stat.value}
                  </p>
                </div>
                <p className="text-xs text-slate-400 lg:text-sm">
                  {stat.description}
                </p>
              </div>
              <div className="">
                <div className="bg-primary text-secondary grid size-8 place-items-center rounded-md lg:size-10">
                  <stat.icon className="size-5 lg:size-6" strokeWidth={1.8} />
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
                  className="group flex justify-between rounded-xl bg-white px-3 py-3 shadow-lg transition-all duration-200 hover:opacity-80 hover:shadow-2xl md:flex-row md:items-center lg:px-6 lg:py-5"
                >
                  {/* Left: Project Info */}
                  <div className="flex items-center gap-3 md:flex-1 lg:gap-4">
                    <GripVertical className="size-5 shrink-0 text-slate-400 lg:size-8" />
                    <div>
                      <h2 className="group-hover:text-primary font-semibold text-slate-800 lg:text-lg">
                        {project.title}
                      </h2>
                      <p className="mt-1 text-xs text-slate-500 lg:text-sm">
                        Created:{" "}
                        {format(new Date(project.createdAt), "dd MMMM yyyy")}
                      </p>
                    </div>
                  </div>

                  {/* Right: Status, Employees, Progress */}
                  <div className="flex flex-wrap items-center justify-between gap-8 md:mt-0 md:w-auto md:justify-end">
                    {/* Tasks */}
                    <div className="hidden items-center gap-2 lg:flex">
                      <ListCheck className="size-4 text-slate-600" />
                      <p
                        className={`font-semibold capitalize ${status?.bgColor}`}
                      >
                        {project.Tasks.length} Tasks
                      </p>
                    </div>

                    {/* Status */}
                    <div className="hidden items-center gap-2 lg:flex">
                      <Info className="size-4 text-slate-600" />
                      <p
                        className={`font-semibold capitalize ${status?.bgColor}`}
                      >
                        {status?.label}
                      </p>
                    </div>

                    {/* Employees */}
                    <div className="hidden items-center gap-2 lg:flex">
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
