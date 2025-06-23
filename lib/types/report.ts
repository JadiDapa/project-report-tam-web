import { AccountType } from "./account";
import { ProjectType } from "./project";
import { CreateReportEvidenceType } from "./report-evidence";

export interface CreateReportType {
  title: string;
  description?: string;
  serialNumber: string;
  location: string;
  projectId: number | string;
  accountId: number | string;
  ReportEvidences?: CreateReportEvidenceType[];
}

export interface ReportType extends CreateReportType {
  id: number;
  Project: ProjectType;
  Account: AccountType;
  createdAt: Date;
  updatedAt: Date;
}
