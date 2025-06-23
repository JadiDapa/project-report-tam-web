import { AccountType } from "./account";
import { ProjectType } from "./project";

interface CreateProjectAssignmentType {
  accountId: number;
  projectId: number;
}

export interface ProjectAssignmentType extends CreateProjectAssignmentType {
  id: number;
  Account: AccountType;
  Project: ProjectType;
}
