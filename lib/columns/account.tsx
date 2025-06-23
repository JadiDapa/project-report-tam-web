import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import TableSorter from "@/components/root/TableSorter";
import Image from "next/image";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { AccountType } from "../types/account";

export const accountColumn: ColumnDef<AccountType>[] = [
  {
    accessorKey: "id",
    accessorFn: (row) => row.id,
    header: ({ column }) => <TableSorter isFirst column={column} header="#" />,
    cell: ({ row }) => (
      <div className="text-primary translate-x-4">{row.index + 1}</div>
    ),
  },
  {
    accessorKey: "image",
    accessorFn: (row) => row.image,
    header: ({ column }) => <TableSorter column={column} header="IMAGE" />,
    cell: ({ getValue }) => (
      <div className="relative aspect-video h-24 w-40 overflow-hidden rounded-md">
        <Image
          src={
            (getValue() as string) ||
            "https://wallpapers.com/images/hd/placeholder-profile-icon-8qmjk1094ijhbem9.jpg"
          }
          className="object-contain object-center"
          alt={(getValue() as string) + " Image"}
          fill
        />
      </div>
    ),
  },
  {
    accessorKey: "name",
    accessorFn: (row) => row.fullname,
    header: ({ column }) => <TableSorter column={column} header="FULL NAME" />,
    cell: ({ getValue }) => (
      <div className="text-base">{getValue() as string}</div>
    ),
  },
  {
    accessorKey: "role",
    accessorFn: (row) => row.Role.name,
    header: ({ column }) => <TableSorter column={column} header="ROLE" />,
    cell: ({ getValue }) => (
      <div className="text-base">{getValue() as string}</div>
    ),
  },
  {
    accessorKey: "projects",
    accessorFn: (row) => row.Projects?.length,
    header: ({ column }) => <TableSorter column={column} header="PROJECTS" />,
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
        href={`/items/${row.original.id}`}
        className="bg-primary text-secondary hover:bg-primary/80 cursor-pointer rounded-md px-4 py-1"
      >
        Detail
      </Link>
    ),
  },
];
