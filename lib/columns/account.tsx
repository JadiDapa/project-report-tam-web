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
      <div className="relative aspect-video size-24 overflow-hidden rounded-md border-2">
        <Image
          src={
            (getValue() as string) ||
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAe1BMVEX///8BAQG2trb8/PwEBAT4+PhjY2Py8vLt7e1OTk5nZ2fl5eXg4ODZ2dm7u7vOzs6bm5ukpKQcHBwTExOJiYl+fn6vr68nJyeVlZV2dnbGxsYYGBhHR0fBwcHj4+ONjY1ubm4sLCw2NjY/Pz97e3siIiJVVVVAQEBSUlIituUvAAAEFklEQVR4nO3c23aiMBQG4EA4aUVqqed2qm3Vvv8TTgIeizLZiCvZzP9dzJre5e/eBJIGhAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAuE4qx/+L0/87JU4XQ3+4SGPbA3mIxJ8vvYN85Se2B9SyrO/9FmWiO72avalEQSVjL7M9sBboGsW6fkHwO6H+uc+/V1Ubvldqdx7znXurSvF8rT/Pyvhse4j30LV5vXoFHgLq1n0VfGuo2m9c16J7jCPWt+jJyPZAm8sMKqh/BRnLKqoWDV9MEip5yDKhUBdh5SZ4w7ft0TYhRWp0EZYGtofbSGQaT/0i+rYH28Qf44BlEfldih/m8dTlyvGmmJNqGNgeLl1KCuh5qe0Bk43MJ9ICvyfw6qK+HrfZVIpPYg0/uc00IeF2X+K2AZfQ4incNjSeyAmfbA+ZqPsJu9+lMTkhs5lGhkviXJqHtsdMI0WPmLBne8hkY2LCse0Bk/nEhL7tAZNRpxpmE432QwrI7zLUbWpM9fOE4RpfUq7DQPJLKNUa2LyG/Na/OmE4NZ5Op8xu9yX9t1HTPe9324NtQv9ld2VYwj6/i7Ak5dSgioG3tj3QxqTe9zboU24rwxMppcmuKb+d0gupV9Ooga4w84BSJJ+1BfxKBNdppqRmVFl3WmFcnFJkHVHL1tUzUcWP6y4c+xJFEw5/tWqR9mvIvEFPdIzse3ORcTovjiZ2JGEpTEfjt00e5Ju371HK8kG03mW1OlY9bR9J/yu5H0cEAHBAl+fR/UN2N562/0Nx5s/m0fan97ON5jM/Y/h3iqvKR5nBZFU9LrxZTXieKq1IP6aHBeFxiXhYLK4/eO9hqPKFk91pR6a6RFR2E67LDN2f4cxkzzuf8bwmdT6vbqPt3DPLOg5N30XQDfviM1tSSZFExKN7UcIron/tjcN/1NHn9Jwz9siHL5U5m06Nt+RwZRl7CYcyqktw2iignnanDP4MJcWgSYMeOf9miQp4RzxdSMcjSvG0/HeKuoDe0vFGJZy/uGUdO70N0Lsznq7im8v3jNe7K1i+5eUs8wM0tUV093hNcn+8PVeXUxHxWfSWwItsR7lCTQ4L7657/XlCb+HkdLpuJ19h7d50KskvHNZz8DsLxp8XMJPHzvWp+XlZMyPnnmzaLaF6PnXtShy2GlAbOlbDbavzjLa1HelS0tKt8FziUA0p5/LNuXTDkMQXZMw49RoN/Y1REy69VVr7TbaGAocWUbL4Zln7CV1aCe8ekNDzdrZjncj7NthuyUNnbvqDhwR06etRRt9la8CddfDkQQkntoMdzR6UcGY72FEL26RXufN5LOq796bmziSkfjHJVORMwoX/GAvbwQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHuEvHHwpwBwB0jYAAAAASUVORK5CYII="
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
        href={`/accounts/${row.original.id}`}
        className="bg-primary text-secondary hover:bg-primary/80 cursor-pointer rounded-md px-4 py-1"
      >
        Detail
      </Link>
    ),
  },
];
