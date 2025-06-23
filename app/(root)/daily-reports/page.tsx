"use client";

import { ImageDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import LayoutSwitch from "@/components/root/LayoutSwitch";
import DataTable from "@/components/root/DataTable";
import ExcelExport from "@/components/root/ExcelExport";
import SearchDataTable from "@/components/root/SearchDataTable";
import {
  getAllDailyReports,
  getDailyReportEvidences,
} from "@/lib/networks/daily-report";
import { dailyReportColumn } from "@/lib/columns/daily-report";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

export default function ActivitiesDashboard() {
  const { data: dailyReports } = useQuery({
    queryFn: getAllDailyReports,
    queryKey: ["daily-reports"],
  });

  const handleDownload = async () => {
    if (!dailyReports) return;

    const url = await getDailyReportEvidences(new Date().toDateString());

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

  const excelData = dailyReports?.map((account, i) => ({
    No: i + 1,
    "Created At": format(account.createdAt, "dd MMMM, yyyy"),
    Account: account.Account.fullname,
    Title: account.title,
    Evidence: account.DailyReportEvidences.length ?? 0,
  }));

  if (dailyReports) {
    return (
      <section className="flex w-full flex-col gap-4 py-6 lg:gap-6">
        {/* Header Title */}
        <div className="flex w-full flex-col justify-between gap-4 lg:flex-row lg:gap-6">
          <div className="">
            <h1 className="text-4xl font-medium">Daily Reports</h1>
            <p className="hidden lg:inline">
              Taruna Anugrah Mandiri Employees Daily Reports
            </p>
          </div>
          <div className="flex items-center gap-4 lg:gap-6">
            <LayoutSwitch />
            <ExcelExport
              data={excelData || []}
              filename={`tam-daily-reports-${format(new Date(), "dd-MMMM-yyyy")}.xlsx`}
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

        <DataTable
          columns={dailyReportColumn}
          data={dailyReports}
          filters={(table) => (
            <div className="grid gap-4 p-4 lg:grid-cols-4 lg:gap-6">
              <SearchDataTable
                table={table}
                column="name"
                placeholder="Search Title..."
              />
              <SearchDataTable
                table={table}
                column="title"
                placeholder="Search Title..."
              />
            </div>
          )}
        />
      </section>
    );
  }
}
