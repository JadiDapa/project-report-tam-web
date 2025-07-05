import { ColumnDef } from "@tanstack/react-table";
import TableSorter from "@/components/root/TableSorter";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { ProjectType } from "../types/project";
// import UpdateProjectModal from "@/components/root/project/UpdateProjectModal";
import Link from "next/link";
import { TaskType } from "../types/task";

export const projectColumn: ColumnDef<ProjectType>[] = [
  {
    accessorKey: "id",
    accessorFn: (row) => row.id,
    header: ({ column }) => <TableSorter isFirst column={column} header="#" />,
    cell: ({ row }) => (
      <div className="text-primary translate-x-4">{row.index + 1}</div>
    ),
  },
  {
    accessorKey: "title",
    accessorFn: (row) => row.title,
    header: ({ column }) => <TableSorter column={column} header="TITLE" />,
    cell: ({ getValue }) => (
      <div className="text-base">{getValue() as string}</div>
    ),
  },
  {
    accessorKey: "status",
    accessorFn: (row) => row.status,
    header: ({ column }) => <TableSorter column={column} header="STATUS" />,
    cell: ({ getValue }) => (
      <div className="text-base">{getValue() as string}</div>
    ),
  },
  {
    accessorKey: "startDate",
    accessorFn: (row) => row.startDate,
    header: ({ column }) => <TableSorter column={column} header="START DATE" />,
    cell: ({ getValue }) => {
      const date = new Date(getValue() as Date);
      return (
        <div className="translate-x-4">
          <div className="text-primary font-semibold">
            {format(date, "HH.mm", { locale: id })}
          </div>
          <div>{format(date, "d MMMM yyyy")}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "endDate",
    accessorFn: (row) => row.endDate,
    header: ({ column }) => (
      <TableSorter column={column} header="DEADLINE" isFirst />
    ),
    cell: ({ getValue }) => {
      const date = new Date(getValue() as Date);
      return (
        <div className="translate-x-4">
          <div className="text-primary font-semibold">
            {format(date, "HH.mm", { locale: id })}
          </div>
          <div>{format(date, "d MMMM yyyy")}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "task",
    accessorFn: (row) => row.Tasks.length,
    header: ({ column }) => <TableSorter column={column} header="TASKS" />,
    cell: ({ getValue }) => (
      <div className="text-base">{getValue() as string} Task</div>
    ),
  },
  {
    accessorKey: "progress",
    accessorFn: (row) => row.Tasks,
    header: ({ column }) => <TableSorter column={column} header="PROGRESS" />,
    cell: ({ getValue }) => {
      function globalPercentage() {
        const tasks = getValue() as TaskType[];
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
      return <div className="text-base">{globalPercentage()} %</div>;
    },
  },
  {
    accessorKey: "function",
    header: ({ column }) => <TableSorter column={column} header="DETAIL" />,
    cell: ({ row }) => (
      <Link href={`/projects/${row.original.id}`}>
        <div className="bg-primary text-secondary hover:bg-primary/80 w-fit cursor-pointer rounded-md px-4 py-1">
          Detail
        </div>
      </Link>
    ),
  },
];
