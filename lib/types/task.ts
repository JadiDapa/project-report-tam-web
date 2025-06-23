import { ProjectType } from "./project";
import { TaskEvidenceType } from "./task-evidence";

export interface CreateTaskType {
  type: string;
  item: string;
  quantity: number;
  description?: string;
  projectId: number | string;
}

export interface TaskType extends CreateTaskType {
  id: number;
  Project: ProjectType;
  TaskEvidences: TaskEvidenceType[];
  createdAt: Date;
  updatedAt: Date;
}
