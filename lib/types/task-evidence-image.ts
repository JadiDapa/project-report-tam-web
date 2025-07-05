import { TaskEvidenceType } from "./task-evidence";
import { AccountType } from "./account";

export interface CreateTaskEvidenceImageType {
  id?: number;
  image: string | File;
  description?: string;
  taskEvidenceId: number;
  accountId?: number;
}

export interface TaskEvidenceImageType extends CreateTaskEvidenceImageType {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  TaskEvidence: TaskEvidenceType;
  Account?: AccountType;
}
