"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import ExcelExport from "@/components/root/ExcelExport";
import { getTaskById, getTaskReportEvidences } from "@/lib/networks/task";
import Image from "next/image";
import { format } from "date-fns";
import { Calendar, ImageDown } from "lucide-react";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Pie, Label, PieChart } from "recharts";
import EvidenceDetailModal from "@/components/root/project/evidence/EvidenceDetailModal";
import { Button } from "@/components/ui/button";

const chartConfig = {
  completed: { label: "Completed", color: "var(--chart-1)" },
  remaining: { label: "Remaining", color: "#e5f3fd" },
} satisfies ChartConfig;

export default function ProjectDetail() {
  const { id } = useParams();

  const { data: task } = useQuery({
    queryFn: () => getTaskById(id as string),
    queryKey: ["tasks", id],
  });

  if (!task) return null;

  const taskProgress =
    (task?.TaskEvidences.filter(
      (evidence) => evidence.TaskEvidenceImages.length > 0,
    ).length /
      (task.quantity ?? 1)) *
    100;

  const chartData = [
    { name: "Completed", value: taskProgress, fill: "var(--chart-1)" },
    {
      name: "Remaining",
      value: 100 - taskProgress,
      fill: "#e5f3fd",
    },
  ];

  const handleDownload = async () => {
    if (!task) return;

    const url = await getTaskReportEvidences(task.id.toString());

    if (!url) {
      alert("No file URL found.");
      return;
    }

    const link = document.createElement("a");
    link.href = url;
    link.download = `Project-Task-Report-${format(new Date(), "dd-MM-yyyy")}.docx`;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="flex w-full flex-col gap-4 py-6 lg:gap-6">
      {/* Header Title */}
      <div className="flex w-full flex-col justify-between gap-4 lg:flex-row lg:gap-6">
        <div className="">
          <h1 className="text-4xl font-semibold">Project Task Detail</h1>
          <p className="hidden lg:inline">
            Taruna Anugrah Mandiri Project Task Detail
          </p>
        </div>
        <div className="flex items-center gap-4 lg:gap-6">
          <ExcelExport
            data={task.TaskEvidences}
            filename="tam-task-evidence.xlsx"
          />
          <Button
            onClick={handleDownload}
            className="bg-primary hover:text-primary border-primary h-10 items-center gap-4 border text-white hover:bg-transparent"
          >
            <p className="text-lg">Download Evidence</p>
            <ImageDown className="size-5" />
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Left Section (Task Info) */}
        <div className="flex-1 rounded-lg bg-white p-4 shadow-lg sm:p-6">
          <div className="flex h-full flex-col justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-600">Task:</p>
              <h1 className="text-primary text-2xl font-bold capitalize">
                {`${task.type} - ${task.item}`}
              </h1>
              <p className="text-sm font-medium text-gray-700">
                From Project: {task.Project.title}
              </p>
              <p className="mt-4 text-sm text-gray-600">
                {task.description || "No Description Provided"}
              </p>
            </div>
            <div className="mt-6 flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="size-5 shrink-0" />
              <p>Created At: {format(task.createdAt, "dd MMMM yyyy")}</p>
            </div>
          </div>
        </div>

        {/* Right Section (Chart) */}
        <div className="w-full rounded-lg bg-white p-4 shadow-lg sm:p-6 lg:max-w-xs">
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square h-40"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-xl font-bold sm:text-2xl"
                          >
                            {Math.floor(taskProgress)}%
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 20}
                            className="fill-muted-foreground text-xs"
                          >
                            Progression
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>

          {/* Summary */}
          <div className="mt-4 text-center">
            <p className="text-sm font-semibold text-gray-700">Task Items</p>
            <p className="text-base font-medium text-gray-800">
              {Math.floor(taskProgress)}% (
              {
                task.TaskEvidences.filter(
                  (e) => e.TaskEvidenceImages.length > 0,
                ).length
              }{" "}
              / {task.quantity})
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-primary text-xl font-semibold sm:text-2xl">
          Task Evidences
        </h2>
        <p className="text-sm text-gray-600">Task Evidence Report</p>

        <div className="mt-4 grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-3 xl:grid-cols-4">
          {task.TaskEvidences.map((evidence) => (
            <EvidenceDetailModal
              key={evidence.id}
              evidence={evidence}
              taskId={id as string}
            >
              <div className="flex flex-col items-center gap-3 rounded-xl bg-white p-4 shadow-md transition hover:shadow-lg">
                {/* Image Preview */}
                <div className="relative aspect-square w-full overflow-hidden rounded border">
                  <Image
                    src={
                      evidence.TaskEvidenceImages.length > 0
                        ? (evidence.TaskEvidenceImages[0].image as string)
                        : "https://static.vecteezy.com/system/resources/thumbnails/016/808/173/small_2x/camera-not-allowed-no-photography-image-not-available-concept-icon-in-line-style-design-isolated-on-white-background-editable-stroke-vector.jpg"
                    }
                    alt={evidence.title as string}
                    fill
                    className="object-contain object-center"
                    unoptimized
                  />
                </div>

                {/* Info Section */}
                <div className="flex w-full flex-col">
                  <p className="text-primary-500 line-clamp-2 text-sm font-semibold capitalize">
                    {evidence.title}
                  </p>

                  {evidence.TaskEvidenceImages.length > 0 ? (
                    <>
                      <p className="mt-2 line-clamp-2 text-sm font-medium text-gray-700">
                        By {evidence.TaskEvidenceImages[0]?.Account?.fullname}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {format(evidence.createdAt, "MMM dd, yyyy")}
                      </p>
                    </>
                  ) : (
                    <div className="mt-2">
                      <p className="text-sm font-bold text-red-500">
                        No Report Yet
                      </p>
                      <p className="text-xs text-gray-500">
                        (Click to Upload Evidence)
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </EvidenceDetailModal>
          ))}
        </div>
      </div>
    </section>
  );
}
