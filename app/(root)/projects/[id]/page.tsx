"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { getProjectById } from "@/lib/networks/project";
import ExcelExport from "@/components/root/ExcelExport";
import LayoutSwitch from "@/components/root/LayoutSwitch";
import DataTable from "@/components/root/DataTable";
import { taskColumn } from "@/lib/columns/task";
import SearchDataTable from "@/components/root/SearchDataTable";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Label, Pie, PieChart } from "recharts";
import { BetweenHorizonalStart, Calendar } from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRef, useState } from "react";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { createTasks } from "@/lib/networks/task";
import { CreateTaskType } from "@/lib/types/task";
import { toast } from "sonner";

export default function ProjectDetail() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const queryClient = useQueryClient();

  const { id } = useParams();

  const { data: project } = useQuery({
    queryFn: () => getProjectById(id as string),
    queryKey: ["project", id],
  });

  const { mutate: onCreateTasks } = useMutation({
    mutationFn: (values: CreateTaskType[]) => createTasks(values),
    onSuccess: () => {
      toast.success("Task Created Successfully!");
      queryClient.invalidateQueries({ queryKey: ["project", id] });
    },
    onError: (err) => {
      console.log(err);
      toast.error("Something Went Wrong!");
    },
  });

  const tasks = project?.Tasks;

  function globalPercentage() {
    if (!project?.Tasks || project?.Tasks.length === 0) return 0;

    const totalPercentage = project?.Tasks.reduce((sum, task) => {
      const filledEvidences = task.TaskEvidences.filter(
        (e) => e.TaskEvidenceImages.length > 0,
      ).length;
      const taskCompletion = Math.min(
        filledEvidences / (task.quantity ?? 1),
        1,
      ); // Cap at 100%
      return sum + taskCompletion;
    }, 0);

    const averagePercentage = (totalPercentage / project.Tasks.length) * 100;
    return Math.round(averagePercentage);
  }

  const chartData = [
    { name: "Completed", value: globalPercentage(), fill: "var(--chart-1)" },
    {
      name: "Remaining",
      value: 100 - globalPercentage(),
      fill: "#e5f3fd",
    },
  ];
  const chartConfig = {
    completed: { label: "Completed", color: "var(--chart-1)" },
    remaining: { label: "Remaining", color: "#e5f3fd" },
  } satisfies ChartConfig;

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: "array" });

      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const formatted = jsonData.map((row: any) => ({
        type: row["type"]?.toString().trim() || "",
        item: row["item"]?.toString().trim() || "",
        quantity: Number(row["quantity"]) || 0,
        projectId:
          typeof project?.id === "string"
            ? Number(project.id)
            : (project?.id ?? 0),
      }));

      // 🔥 You need to define or pass this function to actually save the tasks
      onCreateTasks(formatted);
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
      event.target.value = ""; // Clear file input
    }
  };

  if (!project && !tasks) return null;

  return (
    <section className="flex w-full flex-col gap-4 py-6 lg:gap-6">
      {/* Header Title */}
      <div className="flex w-full flex-col justify-between gap-4 lg:flex-row lg:gap-6">
        <div className="">
          <h1 className="text-4xl font-medium">Project Detail</h1>
          <p className="hidden lg:inline">
            Taruna Anugrah Mandiri Project List
          </p>
        </div>
        <div className="flex items-center gap-4 lg:gap-6">
          <LayoutSwitch />
          <ExcelExport data={project.Tasks} filename="tam-projects.xlsx" />
          <Button
            onClick={handleUploadClick}
            className="bg-primary hover:text-primary border-primary h-10 items-center gap-4 border text-white hover:bg-transparent"
            disabled={uploading}
          >
            <p className="text-lg">Upload Excel</p>
            <BetweenHorizonalStart className="size-5" />

            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileChange}
              className="hidden"
            />
          </Button>
        </div>
      </div>

      <div className="flex gap-6">
        <div className="flex flex-1 justify-between rounded-lg bg-white p-6 shadow-lg">
          <div className="flex-1">
            <p className="font-bold">Project :</p>
            <h1 className="text-primary text-2xl font-semibold">
              {project.title}
            </h1>
            <p className="mt-3">{project.description}</p>
            <div className="mt-12 flex gap-24">
              <div className="flex items-center gap-2">
                <Calendar className="size-5" />
                <p>Start: {format(project.startDate, "dd MMMM yyyy")}</p>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="size-5" />
                <p>Deadline: {format(project.startDate, "dd MMMM yyyy")}</p>
              </div>
            </div>
          </div>
          <div className="pb-0">
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
                              {Math.floor(globalPercentage())} %
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
          </div>
        </div>
        <div className="w-72 rounded-lg bg-white p-6 shadow-lg">
          <div className="flex gap-2">
            <p className="text-xl font-semibold">Employees: </p>
            <p className="text-primary text-xl font-semibold">
              ({project.Employees.length})
            </p>
          </div>

          {project.Employees.length > 0 ? (
            <ScrollArea className="mt-2 flex h-40 flex-col gap-2 overflow-hidden">
              {project.Employees.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-2 rounded-md border-b p-2"
                >
                  <div className="relative size-8 items-center overflow-hidden rounded-full border">
                    <Image
                      src={
                        (user.Account.image as string) ||
                        "https://wallpapers.com/images/hd/placeholder-profile-icon-8qmjk1094ijhbem9.jpg"
                      }
                      alt={user.Account.fullname}
                      fill
                      className="object-cover object-center"
                    />
                  </div>
                  <div className="">
                    <p className="font-medium">{user.Account.fullname}</p>
                    <p className="text-primary text-xs font-semibold">
                      {user.Account.Role.name ?? ""}
                    </p>
                  </div>
                </div>
              ))}
            </ScrollArea>
          ) : (
            <p className="text-muted-foreground mt-4 text-center">
              No assigned employees
            </p>
          )}
        </div>
      </div>

      <DataTable
        columns={taskColumn}
        data={tasks ?? []}
        title="Project Task"
        filters={(table) => (
          <div className="grid gap-4 p-4 lg:grid-cols-4 lg:gap-6">
            <SearchDataTable
              table={table}
              column="item"
              placeholder="Search Item..."
            />
          </div>
        )}
      />
    </section>
  );
}
