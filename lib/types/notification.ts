import { AccountType } from "./account";

export interface CreateNotificationType {
  accountId: number;
  type: NotificationEventType;
  title: string;
  description?: string;
  link?: string;
  isRead: boolean;
}

export interface NotificationType extends CreateNotificationType {
  id: number;
  createdAt: Date;
  Account: AccountType;
}

export type NotificationEventType =
  | "PROJECT_ASSIGNED"
  | "REPORT_APPROVED"
  | "TICKET_SUBMITTED"
  | "OTHER";
