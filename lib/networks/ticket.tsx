import { axiosInstance } from "./axiosInstance";
import { TicketType, CreateTicketType } from "../types/ticket";
import { CreateTicketMessageType } from "../types/ticket-message";

export async function getAllTickets() {
  const { data } = await axiosInstance.get<{ data: TicketType[] }>("/tickets");
  return data.data;
}

export async function getTicketsByRequesterId(accountId: string) {
  const { data } = await axiosInstance.get<{ data: TicketType[] }>(
    "/tickets/requester/" + accountId,
  );
  return data.data;
}

export async function getTicketsByHandlerId(accountId: string) {
  const { data } = await axiosInstance.get<{ data: TicketType[] }>(
    "/tickets/handler/" + accountId,
  );
  return data.data;
}

export async function getTicketById(id: string) {
  const { data } = await axiosInstance.get<{ data: TicketType }>(
    "/tickets/" + id,
  );
  return data.data;
}

export async function createTicket(values: CreateTicketType) {
  const formData = new FormData();
  formData.append("title", values.title);
  formData.append("priority", values.priority!);
  formData.append("description", values.description!);
  formData.append("requester", values.requester!.toString());
  if (values.image) {
    formData.append("image", values.image);
  }

  const { data } = await axiosInstance.post("/tickets", formData, {
    headers: {
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
    },
  });

  return data.data;
}

export async function createTicketMessage(
  id: string,
  values: CreateTicketMessageType,
) {
  const formData = new FormData();
  formData.append("content", values.content);
  formData.append("ticketId", values.ticketId.toString());
  formData.append("accountId", values.accountId.toString());
  if (values.type) formData.append("type", values.type);
  if (values.image instanceof File) {
    formData.append("image", values.image);
  }

  try {
    const { data } = await axiosInstance.post(`/tickets/${id}`, formData, {
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
    });

    return data.data;
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
}

export async function updateTicket(
  id: string,
  values: Partial<CreateTicketType>,
) {
  const { data } = await axiosInstance.put("/tickets/" + id, values);

  return data.data;
}

export async function deleteTicket(id: string) {
  const { data } = await axiosInstance.delete("/tickets/" + id);
  return data.data;
}
