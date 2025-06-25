import { DailyReportType } from "./daily-report";
import { ProjectType } from "./project";
import { ReportType } from "./report";
import { ReportDiscussionType } from "./report-discussion";
import { RoleType } from "./role";

export interface CreateAccountType {
  fullname: string;
  email: string;
  roleId: number;
  image?: string;
  phoneNumber?: string;
  password?: string;
}

export interface AccountType extends CreateAccountType {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  Role: RoleType;
  Reports?: ReportType[];
  Projects?: ProjectType[];
  ReportDiscussions?: ReportDiscussionType[];
  DailyReports?: DailyReportType[];
  TicketRequester?: AccountType[];
  TicketHandler?: AccountType[];
}
