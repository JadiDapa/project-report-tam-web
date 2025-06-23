import { AccountType } from "./account";
import { TaskType } from "./task";

export interface CreateTaskEvidenceType {
  image?: string | File;
  description?: string;
  taskId: number;
  accountId?: number;
}

export interface TaskEvidenceType extends CreateTaskEvidenceType {
  id: number;
  Account: AccountType;
  Task: TaskType;
  createdAt: Date;
  updatedAt: Date;
}
