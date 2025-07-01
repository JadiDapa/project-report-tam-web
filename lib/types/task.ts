import { ProjectType } from "./project";
import { TaskEvidenceType } from "./task-evidence";

export interface CreateTaskType {
  type: string;
  item: string;
  quantity?: number;
  description?: string;
  projectId: number;
}

export interface TaskType extends CreateTaskType {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  Project: ProjectType;
  TaskEvidences: TaskEvidenceType[];
}
