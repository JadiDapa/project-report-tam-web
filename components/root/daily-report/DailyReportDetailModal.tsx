"use client";

import { DialogHeader } from "@/components/ui/dialog";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { useState } from "react";
import { Calendar, User } from "lucide-react";
import { DailyReportType } from "@/lib/types/daily-report";
import Image from "next/image";

interface DailyReportDetailModalProps {
  children: React.ReactNode;
  dailyReport: DailyReportType;
}

export default function DailyReportDetailModal({
  children,
  dailyReport,
}: DailyReportDetailModalProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Daily Report Detail
          </DialogTitle>
          <div className="">
            <p className="text-primary text-xl font-medium capitalize">
              {dailyReport.title}
            </p>
            <div className="mt-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="text-primary size-4" />
                <p className="font-medium"> {dailyReport.Account.fullname}</p>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="text-primary size-4" />
                <p className="font-medium">
                  {format(new Date(), "dd MMMM, yyyy")}
                </p>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-lg font-semibold">Detail :</p>
              <p className="prose text-sm">{dailyReport.description}</p>
            </div>
            <div className="mt-4">
              <p className="text-lg font-semibold">Evidences :</p>
              {dailyReport.DailyReportEvidences.length > 0 ? (
                <div className="grid grid-cols-3 gap-6">
                  {dailyReport.DailyReportEvidences.map((evidence) => (
                    <div
                      key={evidence?.id}
                      className="relative size-40 rounded-lg border-2 border-dashed border-slate-400 p-1"
                    >
                      <Image
                        src={evidence.image}
                        alt={evidence.image}
                        fill
                        className="object-cover object-center"
                        unoptimized
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="prose text-sm">No Evidences</p>
              )}
            </div>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
