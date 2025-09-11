import { AccountType } from "./account";
import { TicketMessageType } from "./ticket-message";

export interface CreateTicketType {
  title: string;
  description?: string;
  image?: string | File;
  status?: string;
  priority?: string;
  requester: number;
  handler?: number;
}

export interface TicketType extends CreateTicketType {
  id: number;
  code: string;
  Requester: AccountType;
  Handler?: AccountType;
  TicketMessages?: TicketMessageType[];
  createdAt: Date;
  updatedAt: Date;
}
