import { TaskEvidenceType } from "./task-evidence";
import { AccountType } from "./account";

export interface CreateTaskEvidenceImageType {
  id?: number;
  baseImage: string;
  image: string;
  date: Date;
  latitude: number;
  longitude: number;
  description?: string;
  taskEvidenceId: number;
  accountId?: number;
  isExport?: boolean;
}

export interface TaskEvidenceImageType extends CreateTaskEvidenceImageType {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  TaskEvidence: TaskEvidenceType;
  Account?: AccountType;
}
