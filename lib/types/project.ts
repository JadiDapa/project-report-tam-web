import { ProjectAssignmentType } from "./project-assignment";
import { ReportType } from "./report";
import { TaskType } from "./task";

export interface CreateProjectType {
  title: string;
  description?: string;
  image?: string;
  startDate: Date;
  endDate: Date;
  status: string;
  Employees: ProjectAssignmentType[];
}

export interface ProjectType extends CreateProjectType {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  Reports: ReportType[];
  Tasks: TaskType[];
}
