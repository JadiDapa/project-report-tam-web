import { TaskEvidenceImageType } from "./task-evidence-image";
import { TaskType } from "./task";

export interface CreateTaskEvidenceType {
  title: string;
  description?: string;
  taskId: number;
}

export interface TaskEvidenceType extends CreateTaskEvidenceType {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  Task: TaskType;
  TaskEvidenceImages: TaskEvidenceImageType[];
}
