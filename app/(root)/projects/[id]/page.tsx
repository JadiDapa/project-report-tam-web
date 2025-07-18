"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { getProjectById } from "@/lib/networks/project";
import ExcelExport from "@/components/root/ExcelExport";
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
import {
  BetweenHorizonalStart,
  CalendarCheck,
  CalendarX,
  Pencil,
} from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRef, useState } from "react";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { createTasks } from "@/lib/networks/task";
import { CreateTaskType } from "@/lib/types/task";
import { toast } from "sonner";
import UpdateProjectModal from "@/components/root/project/UpdateProjectModal";

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
      queryClient.invalidateQueries({ queryKey: ["projects", id] });
    },
    onError: (err) => {
      console.log(err);
      toast.error("Something Went Wrong!");
    },
  });

  const tasks = project?.Tasks;

  function globalPercentage() {
    if (!project?.Tasks || project.Tasks.length === 0) return 0;

    // Exclude tasks with item === "Documentation"
    const validTasks = project.Tasks.filter(
      (task) => task.item !== "Documentation",
    );
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
          <UpdateProjectModal project={project}>
            <div className="bg-primary text-secondary flex place-items-center gap-4 rounded-md px-4 py-1.5 text-lg shadow-sm">
              <p>Modify Project</p>
              <Pencil size={24} />
            </div>
          </UpdateProjectModal>
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

      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="flex flex-1 flex-col gap-6 rounded-lg bg-white p-4 shadow-lg sm:p-6 lg:flex-row lg:items-start lg:justify-between">
          {/* Left Content */}
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-600">Project:</p>
            <h1 className="text-primary text-2xl font-bold">{project.title}</h1>
            <p className="mt-2 text-sm text-gray-700 sm:text-base">
              {project.description}
            </p>

            {/* Dates */}
            <div className="mt-6 flex flex-col justify-between gap-2 sm:gap-12 lg:flex-row lg:justify-normal">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CalendarCheck className="size-5 shrink-0 lg:block" />
                <p>
                  Start:{" "}
                  <span className="text-primary font-medium">
                    {format(project.startDate, "dd MMMM yyyy")}
                  </span>
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CalendarX className="size-5 shrink-0 lg:block" />
                <p>
                  Deadline:{" "}
                  <span className="text-primary font-medium">
                    {format(project.endDate, "dd MMMM yyyy")}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Right Chart */}
          <div className="mx-auto w-full max-w-[200px] sm:max-w-[250px] lg:mx-0">
            <ChartContainer config={chartConfig} className="aspect-square">
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
                              {globalPercentage()} %
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
          </div>
        </div>

        <div className="w-full rounded-lg bg-white p-6 shadow-lg lg:w-80">
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
