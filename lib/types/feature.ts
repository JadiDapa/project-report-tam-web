import { AccountType } from "./account";
import { RoleType } from "./role";

export interface CreateFeatureType {
  name: string;
  description: string;
}

export interface FeatureType extends CreateFeatureType {
  id: number;
  Role?: RoleType[];
  Accounts?: AccountType[];
  createdAt: Date;
  updatedAt: Date;
}
