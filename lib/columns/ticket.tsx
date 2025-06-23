import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import TableSorter from "@/components/root/TableSorter";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { TicketType } from "../types/ticket";

export const ticketColumn: ColumnDef<TicketType>[] = [
  {
    accessorKey: "id",
    accessorFn: (row) => row.id,
    header: ({ column }) => <TableSorter isFirst column={column} header="#" />,
    cell: ({ row }) => (
      <div className="text-primary translate-x-4">{row.index + 1}</div>
    ),
  },
  {
    accessorKey: "requester",
    accessorFn: (row) => row.Requester.fullname,
    header: ({ column }) => <TableSorter column={column} header="REQUESTER" />,
    cell: ({ getValue }) => (
      <div className="text-base">{getValue() as string}</div>
    ),
  },
  {
    accessorKey: "handler",
    accessorFn: (row) => row.Handler?.fullname,
    header: ({ column }) => <TableSorter column={column} header="HANDLER" />,
    cell: ({ getValue }) => (
      <div className="text-base">
        {(getValue() as string) || "Not Assigned Yet"}
      </div>
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
    accessorKey: "createdAt",
    accessorFn: (row) => row.createdAt,
    header: ({ column }) => (
      <TableSorter column={column} header="DATE/TIME" isFirst />
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
    accessorKey: "function",
    header: ({ column }) => <TableSorter column={column} header="DETAIL" />,
    cell: ({ row }) => (
      <Link
        href={`/tickets/${row.original.id}`}
        className="bg-primary text-secondary hover:bg-primary/80 cursor-pointer rounded-md px-4 py-1"
      >
        Detail
      </Link>
    ),
  },
];
