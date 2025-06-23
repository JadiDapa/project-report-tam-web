import { AccountType } from "./account";
import { DailyReportEvidenceType } from "./daily-report-evidence.";

export interface CreateDailyReportType {
  title: string;
  description?: string;
  accountId: number | string;
  DailyReportEvidences: DailyReportEvidenceType[];
}

export interface DailyReportType extends CreateDailyReportType {
  id: number;
  Account: AccountType;
  createdAt: Date;
  updatedAt: Date;
}
