"use client";

import { useQuery } from "@tanstack/react-query";
import LayoutSwitch from "@/components/root/LayoutSwitch";
import ExcelExport from "@/components/root/ExcelExport";
import { getProjectsByAccountId } from "@/lib/networks/project";
import { useAccount } from "@/providers/AccountProvider";
import CircularProgress from "@/components/root/CircularProgress";
import { GripVertical, ListCheck, Info, UsersRound } from "lucide-react";
import { statuses } from "../../projects/page";
import { format } from "date-fns";
import { TaskEvidenceType } from "@/lib/types/task-evidence";
import Link from "next/link";

export default function ProjectsDashboard() {
  const { account } = useAccount();

  const { data: projects } = useQuery({
    queryFn: () => getProjectsByAccountId(String(account?.id ?? "")),
    queryKey: ["projects", account?.id],
  });

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

  console.log(projects);

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
                  className="group flex w-full justify-between rounded-xl bg-white px-3 py-3 shadow-lg transition-all duration-200 hover:opacity-80 hover:shadow-2xl md:flex-row md:items-center lg:px-6 lg:py-5"
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
