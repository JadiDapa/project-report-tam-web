import { ColumnDef } from "@tanstack/react-table";
import TableSorter from "@/components/root/TableSorter";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { DailyReportType } from "../types/daily-report";
import DailyReportDetailModal from "@/components/root/daily-report/DailyReportDetailModal";

export const dailyReportColumn: ColumnDef<DailyReportType>[] = [
  {
    accessorKey: "id",
    accessorFn: (row) => row.id,
    header: ({ column }) => <TableSorter isFirst column={column} header="#" />,
    cell: ({ row }) => (
      <div className="text-primary translate-x-4">{row.index + 1}</div>
    ),
  },

  {
    accessorKey: "name",
    accessorFn: (row) => row.Account.fullname,
    header: ({ column }) => <TableSorter column={column} header="FULL NAME" />,
    cell: ({ getValue }) => (
      <div className="text-base">{getValue() as string}</div>
    ),
  },
  {
    accessorKey: "title",
    accessorFn: (row) => row.title,
    header: ({ column }) => <TableSorter column={column} header="TITLE" />,
    cell: ({ getValue }) => (
      <div className="w-80 text-base break-words whitespace-pre-wrap">
        {getValue() as string}
      </div>
    ),
  },
  {
    accessorKey: "description",
    accessorFn: (row) => row.description,
    header: ({ column }) => (
      <TableSorter column={column} header="DESCRIPTION" />
    ),
    cell: ({ getValue }) => (
      <div className="break-wordsw line-clamp-2 w-80 text-sm whitespace-pre-wrap">
        {getValue() as string}
      </div>
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
      <DailyReportDetailModal dailyReport={row.original}>
        <div className="bg-primary text-secondary hover:bg-primary/80 cursor-pointer rounded-md px-4 py-1">
          Detail
        </div>
      </DailyReportDetailModal>
    ),
  },
];

export const accountDailyReportColumn: ColumnDef<DailyReportType>[] = [
  {
    accessorKey: "id",
    accessorFn: (row) => row.id,
    header: ({ column }) => <TableSorter isFirst column={column} header="#" />,
    cell: ({ row }) => (
      <div className="text-primary translate-x-4">{row.index + 1}</div>
    ),
  },

  {
    accessorKey: "name",
    accessorFn: (row) => row.Account.fullname,
    header: ({ column }) => <TableSorter column={column} header="FULL NAME" />,
    cell: ({ getValue }) => (
      <div className="text-base">{getValue() as string}</div>
    ),
  },
  {
    accessorKey: "title",
    accessorFn: (row) => row.title,
    header: ({ column }) => <TableSorter column={column} header="TITLE" />,
    cell: ({ getValue }) => (
      <div className="w-80 text-base break-words whitespace-pre-wrap">
        {getValue() as string}
      </div>
    ),
  },
  {
    accessorKey: "description",
    accessorFn: (row) => row.description,
    header: ({ column }) => (
      <TableSorter column={column} header="DESCRIPTION" />
    ),
    cell: ({ getValue }) => (
      <div className="break-wordsw line-clamp-2 w-80 text-sm whitespace-pre-wrap">
        {getValue() as string}
      </div>
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
      <DailyReportDetailModal dailyReport={row.original}>
        <div className="bg-primary text-secondary hover:bg-primary/80 cursor-pointer rounded-md px-4 py-1">
          Detail
        </div>
      </DailyReportDetailModal>
    ),
  },
];
