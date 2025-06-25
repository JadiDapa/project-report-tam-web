"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import ExcelExport from "@/components/root/ExcelExport";
import LayoutSwitch from "@/components/root/LayoutSwitch";
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
    queryKey: ["task"],
  });

  if (!task) return null;

  const taskProgress =
    (task?.TaskEvidences.filter((evidence) => evidence.image).length /
      task?.quantity) *
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
          <LayoutSwitch />
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

      <div className="flex gap-6">
        <div className="flex flex-1 rounded-lg bg-white p-6 shadow-lg">
          <div className="flex flex-1 flex-col justify-between">
            <div className="">
              <p className="font-bold">Task :</p>
              <h1 className="text-primary text-2xl font-semibold capitalize">
                {`${task.type} - ${task.item}`}
              </h1>
              <p className="text-sm font-medium">
                From Project : {task.Project.title}
              </p>
              <p className="mt-4">
                {task.description || "No Description Provided"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="size-5" />
              <p>Created At: {format(task.createdAt, "dd MMMM yyyy")}</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-lg">
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
                            className="fill-foreground text-3xl font-bold"
                          >
                            {taskProgress.toLocaleString()} %
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
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
          <div className="mt-2 text-center">
            <p className="font-semibold">Task Items</p>
            <p className="text-lg font-medium">
              {taskProgress}% (
              {task.TaskEvidences.filter((e) => e.image).length} /{" "}
              {task.quantity})
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <h2 className="text-primary text-2xl font-semibold">Task Evidences</h2>
        <p>Task Evidence Report</p>
        <div className="mt-2 grid grid-cols-4 gap-6">
          {task.TaskEvidences.map((evidence) => (
            <EvidenceDetailModal key={evidence.id} evidence={evidence}>
              <div className="flex flex-col items-center gap-3 rounded-xl bg-white p-4 shadow-md">
                <div className="relative aspect-square w-full border">
                  <Image
                    src={
                      (evidence.image as string) ||
                      "https://static.vecteezy.com/system/resources/thumbnails/016/808/173/small_2x/camera-not-allowed-no-photography-image-not-available-concept-icon-in-line-style-design-isolated-on-white-background-editable-stroke-vector.jpg"
                    }
                    alt={evidence.description as string}
                    fill
                    className="object-contain object-center"
                    unoptimized
                  />
                </div>
                <div className="flex w-full flex-col justify-between">
                  <p className="text-primary-500 line-clamp-2 font-semibold capitalize">
                    {evidence.description}
                  </p>
                  {evidence.image ? (
                    <p className="mt-2 line-clamp-2 font-medium">
                      By {evidence.Account.fullname}
                    </p>
                  ) : (
                    <div className="mt-2">
                      <p className="line-clamp-2 font-bold text-red-400">
                        No Report Yet
                      </p>
                      <p className="font-regular mt-1 text-xs">
                        (Click to Upload Evidence)
                      </p>
                    </div>
                  )}

                  {evidence.image && (
                    <div className="mt-1 flex-row items-center justify-between">
                      <p className="font-regular text-xs text-slate-500">
                        {format(evidence.createdAt, "MMM dd, yyyy")}
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
