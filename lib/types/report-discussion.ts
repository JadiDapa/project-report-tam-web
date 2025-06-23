import { AccountType } from "./account";
import { ReportType } from "./report";

export interface ReportDiscussionType extends CreateReportDiscussionType {
  id: number;
  Report: ReportType;
  Account: AccountType;
  mainContent?: ReportDiscussionType;
  Replies: ReportDiscussionType[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateReportDiscussionType {
  content: string;
  accountId: number;
  reportId: number;
  mainContentId?: number;
}
