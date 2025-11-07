import { ProgramAssignmentType } from "./program-assignment";
import { ProjectType } from "./project";

export interface CreateProgramType {
  title: string;
  description?: string;
  status: string;
  Accounts: ProgramAssignmentType[];
}

export interface ProgramType extends CreateProgramType {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  Projects: ProjectType[];
}
