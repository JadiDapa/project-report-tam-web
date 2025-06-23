import { ColumnDef } from "@tanstack/react-table";
import TableSorter from "@/components/root/TableSorter";
import { format } from "date-fns";
import { id } from "date-fns/locale";
// import UpdateProjectModal from "@/components/root/project/UpdateProjectModal";
import { TaskType } from "../types/task";
import { TaskEvidenceType } from "../types/task-evidence";
import Link from "next/link";

export const taskColumn: ColumnDef<TaskType>[] = [
  {
    accessorKey: "id",
    accessorFn: (row) => row.id,
    header: ({ column }) => <TableSorter isFirst column={column} header="#" />,
    cell: ({ row }) => (
      <div className="text-primary translate-x-4">{row.index + 1}</div>
    ),
  },
  {
    accessorKey: "type",
    accessorFn: (row) => row.type,
    header: ({ column }) => <TableSorter column={column} header="TYPE" />,
    cell: ({ getValue }) => (
      <div className="text-base">{getValue() as string}</div>
    ),
  },
  {
    accessorKey: "item",
    accessorFn: (row) => row.item,
    header: ({ column }) => <TableSorter column={column} header="ITEM" />,
    cell: ({ getValue }) => (
      <div className="text-base">{getValue() as string}</div>
    ),
  },
  {
    accessorKey: "quantity",
    accessorFn: (row) => row.quantity,
    header: ({ column }) => <TableSorter column={column} header="QUANTITY" />,
    cell: ({ getValue }) => {
      return <div className="text-base">{getValue() as string}</div>;
    },
  },
  {
    accessorKey: "progress",
    accessorFn: (row) => row.TaskEvidences,
    header: ({ column }) => <TableSorter column={column} header="PROGRESS" />,
    cell: ({ getValue }) => {
      const evidences = getValue() as TaskEvidenceType[];

      const total = evidences.length;
      const withImage = evidences.filter((evidence) => evidence.image).length;

      const progress = total > 0 ? Math.round((withImage / total) * 100) : 0;

      return <div className="text-base">{progress}%</div>;
    },
  },
  {
    accessorKey: "date",
    accessorFn: (row) => row.createdAt,
    header: ({ column }) => <TableSorter column={column} header="DATE" />,
    cell: ({ getValue }) => {
      const date = new Date(getValue() as Date);
      return (
        <div>
          <div className="text-primary font-semibold">
            {format(date, "HH.mm", { locale: id })}
          </div>
          <div>{format(date, "d MMMM yyyy")}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "function",
    header: ({ column }) => <TableSorter column={column} header="DETAIL" />,
    cell: ({ row }) => (
      <Link href={`/projects/task/${row.original.id}`}>
        <div className="bg-primary text-secondary hover:bg-primary/80 w-fit cursor-pointer rounded-md px-4 py-1">
          Detail
        </div>
      </Link>
    ),
  },
];
