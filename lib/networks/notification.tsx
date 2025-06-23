import { axiosInstance } from "./axiosInstance";
import {
  NotificationType,
  CreateNotificationType,
} from "../types/notification";

export async function getAllNotifications() {
  const { data } = await axiosInstance.get<{ data: NotificationType[] }>(
    "/notifications"
  );
  return data.data;
}

export async function getNotificationsByAccountId(accountId: string) {
  const { data } = await axiosInstance.get<{ data: NotificationType[] }>(
    "/notifications/account/" + accountId
  );
  return data.data;
}

export async function getNotificationById(id: string) {
  const { data } = await axiosInstance.get<{ data: NotificationType }>(
    "/notifications/" + id
  );
  return data.data;
}

export async function createNotification(values: CreateNotificationType) {
  const { data } = await axiosInstance.post("/notifications", values);

  return data.data;
}

export async function updateNotification(
  id: string,
  values: CreateNotificationType
) {
  const { data } = await axiosInstance.put("/notifications/" + id, values);

  return data.data;
}

export async function deleteNotification(id: string) {
  const { data } = await axiosInstance.delete("/notifications/" + id);
  return data.data;
}
