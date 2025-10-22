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
import ExcelExport from "@/components/root/ExcelExport";
import { getProjectsByProgramId } from "@/lib/networks/project";
import CreateProjectModal from "@/components/root/project/CreateProjectModal";
import Link from "next/link";
import CircularProgress from "@/components/root/CircularProgress";
import { format } from "date-fns";
import { useAccount } from "@/providers/AccountProvider";
import { useParams } from "next/navigation";
import { TaskType } from "@/lib/types/task";
import { getProgramById } from "@/lib/networks/program";
import { ProgramType } from "@/lib/types/program";

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

export default function ProgramProjectsDashboard() {
  const { id } = useParams();
  const { account } = useAccount();
  // const router = useRouter();

  const { data: projects } = useQuery({
    queryFn: () => getProjectsByProgramId(id as string),
    queryKey: ["projects"],
  });

  const { data: program } = useQuery({
    queryFn: () => getProgramById(id as string),
    queryKey: ["programs", id],
  });

  // useEffect(() => {
  //   if (account && account.Role.name !== "Administrator") {
  //     router.replace("/programs");
  //   }
  // }, [id, account, router]);

  const isProjectManager = account?.Role?.Features?.some(
    (feature) => feature.name === "Manage Project",
  );

  function globalPercentage(tasks: TaskType[]) {
    if (!tasks || tasks.length === 0) return 0;

    // Exclude tasks with item === "Documentation"
    const validTasks = tasks.filter((task) => task.item !== "Documentation");
    if (validTasks.length === 0) return 0;

    const totalPercentage = validTasks.reduce((sum, task) => {
      const filledEvidences = task.TaskEvidences.filter(
        (e) => e.TaskEvidenceImages.length > 0,
      ).length;
      const taskCompletion = Math.min(
        filledEvidences / (task.quantity ?? 1),
        1,
      );
      return sum + taskCompletion;
    }, 0);

    const averagePercentage = (totalPercentage / validTasks.length) * 100;
    return Number(averagePercentage.toFixed(1));
  }

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
      value:
        projects && projects.length > 0
          ? projects[projects.length - 1].title
          : "No Project Found",
      icon: Clock,
      description: "Most recently created project",
    },
  ];

  return (
    <section className="flex w-full flex-col gap-4 py-6 lg:gap-6">
      {/* Header Title */}
      <div className="flex w-full flex-col justify-between gap-4 lg:flex-row lg:gap-6">
        <div className="">
          <h1 className="mb-2 text-4xl font-medium">Projects</h1>
          <p className="hidden lg:inline">
            Program :{" "}
            <span className="text-primary font-semibold">
              {(program as ProgramType)?.title}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-4 lg:gap-6">
          {/* <LayoutSwitch /> */}
          {isProjectManager && projects && (
            <ExcelExport data={projects} filename="tam-projects.xlsx" />
          )}

          {isProjectManager && program && (
            <CreateProjectModal
              programId={id as string}
              program={(program as ProgramType) || []}
            >
              <div className="bg-primary text-secondary grid size-10 place-items-center gap-4 rounded-md text-lg shadow-sm">
                <Plus size={24} />
              </div>
            </CreateProjectModal>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-6">
        {statistics?.map((stat) => (
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

      <div className="space-y-4">
        <div className="">
          <p className="text-2xl font-medium">Project List</p>
        </div>
        <div className="flex flex-col gap-4">
          {projects && projects.length > 0 ? (
            projects?.map((project) => {
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
            })
          ) : (
            <div className="flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-slate-300 bg-white p-6 text-center">
              <ClipboardCheck className="size-10 text-slate-400" />
              <p className="max-w-md text-lg font-medium text-slate-700">
                No projects found. Create first project.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
