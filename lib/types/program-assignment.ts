import { AccountType } from "./account";
import { ProjectType } from "./project";

export interface CreateProgramAssignmentType {
  accountId: string;
  programId?: string;
}

export interface ProgramAssignmentType extends CreateProgramAssignmentType {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  Project: ProjectType;
  Account: AccountType;
}
