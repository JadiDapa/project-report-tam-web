import { AccountType } from "./account";
import { FeatureType } from "./feature";

export interface CreateRoleType {
  name: string;
  description: string;
  Features?: FeatureType[];
}

export interface RoleType extends CreateRoleType {
  id: number;
  Accounts?: AccountType[];
  createdAt: Date;
  updatedAt: Date;
}
