"use client";

import { Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import LayoutSwitch from "@/components/root/LayoutSwitch";
import DataTable from "@/components/root/DataTable";
import ExcelExport from "@/components/root/ExcelExport";
import SearchDataTable from "@/components/root/SearchDataTable";
import { getAllAccounts } from "@/lib/networks/account";
import { accountColumn } from "@/lib/columns/account";
import CreateAccountModal from "@/components/root/account/CreateAccountModal";
import { format } from "date-fns";

export default function AccountsDashboard() {
  const { data: accounts } = useQuery({
    queryFn: getAllAccounts,
    queryKey: ["accounts"],
  });

  const excelData = accounts?.map((account, i) => ({
    No: i + 1,
    "Full Name": account.fullname,
    Email: account.email,
    "Phone Number": account.phoneNumber,
    Role: account.Role.name,
    Projects: account.Projects?.length ?? 0,
    "Daily Reports": account.DailyReports?.length ?? 0,
    "Created At": format(account.createdAt, "dd MMMM, yyyy"),
  }));

  if (accounts) {
    return (
      <section className="flex w-full flex-col gap-4 py-6 lg:gap-6">
        {/* Header Title */}
        <div className="flex w-full flex-col justify-between gap-4 lg:flex-row lg:gap-6">
          <div className="">
            <h1 className="text-4xl font-medium">Account List</h1>
            <p className="hidden lg:inline">
              Taruna Anugrah Mandiri Account List
            </p>
          </div>
          <div className="flex items-center gap-4 lg:gap-6">
            <LayoutSwitch />
            <ExcelExport
              data={excelData || []}
              filename={`tam-accounts-${format(new Date(), "dd-MMMM-yyyy")}.xlsx`}
            />

            <CreateAccountModal>
              <div className="bg-primary text-secondary grid size-10 place-items-center gap-4 rounded-md text-lg shadow-sm">
                <Plus size={24} />
              </div>
            </CreateAccountModal>
          </div>
        </div>

        <DataTable
          columns={accountColumn}
          data={accounts}
          filters={(table) => (
            <div className="grid gap-4 p-4 lg:grid-cols-4 lg:gap-6">
              <SearchDataTable
                table={table}
                column="fullname"
                placeholder="Search Full Name..."
              />
              <SearchDataTable
                table={table}
                column="role"
                placeholder="Search Account Role..."
              />
            </div>
          )}
        />
      </section>
    );
  }
}
