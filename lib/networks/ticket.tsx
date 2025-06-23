import { axiosInstance } from "./axiosInstance";
import { TicketType, CreateTicketType } from "../types/ticket";
import { CreateTicketMessageType } from "../types/ticket-message";

export async function getAllTickets() {
  const { data } = await axiosInstance.get<{ data: TicketType[] }>("/tickets");
  return data.data;
}

export async function getTicketsByRequesterId(accountId: string) {
  const { data } = await axiosInstance.get<{ data: TicketType[] }>(
    "/tickets/requester/" + accountId
  );
  return data.data;
}

export async function getTicketsByHandlerId(accountId: string) {
  const { data } = await axiosInstance.get<{ data: TicketType[] }>(
    "/tickets/handler/" + accountId
  );
  return data.data;
}

export async function getTicketById(id: string) {
  const { data } = await axiosInstance.get<{ data: TicketType }>(
    "/tickets/" + id
  );
  return data.data;
}

export async function createTicket(values: CreateTicketType) {
  const { data } = await axiosInstance.post("/tickets", values);

  return data.data;
}

export async function createTicketMessage(
  id: string,
  values: CreateTicketMessageType
) {
  const { data } = await axiosInstance.post("/tickets/" + id, values);

  return data.data;
}

export async function updateTicket(
  id: string,
  values: Partial<CreateTicketType>
) {
  const { data } = await axiosInstance.put("/tickets/" + id, values);

  return data.data;
}

export async function deleteTicket(id: string) {
  const { data } = await axiosInstance.delete("/tickets/" + id);
  return data.data;
}
