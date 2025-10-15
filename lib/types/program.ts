import { ProjectType } from "./project";

export interface CreateProgramType {
  title: string;
  description?: string;
  status: string;
}

export interface ProgramType extends CreateProgramType {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  Projects: ProjectType[];
}
