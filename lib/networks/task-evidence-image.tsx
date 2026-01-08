import {
  CreateTaskEvidenceImageType,
  TaskEvidenceImageType,
} from "../types/task-evidence-image";
import { axiosInstance } from "./axiosInstance";

// Fetch all task-evidence-images
export async function getAllTaskEvidenceImages() {
  const { data } = await axiosInstance.get<{
    data: TaskEvidenceImageType[];
  }>("/task-evidence-images");
  return data.data;
}

// Fetch a single TaskEvidenceImage by ID
export async function getTaskEvidenceImageById(id: string) {
  const { data } = await axiosInstance.get<{ data: TaskEvidenceImageType }>(
    `/task-evidence-images/${id}`,
  );
  return data.data;
}

// Create a TaskEvidenceImage (web version)
export async function createTaskEvidenceImage(
  values: CreateTaskEvidenceImageType,
) {
  const formData = new FormData();

  formData.append("image", values.image);
  formData.append("baseImage", values.baseImage);

  formData.append("taskEvidenceId", values.taskEvidenceId.toString());
  if (values.accountId) {
    formData.append("accountId", values.accountId.toString());
  }
  if (values.description) {
    formData.append("description", values.description);
  }
  if (values.date) {
    formData.append("date", values.date);
  }
  if (values.latitude) {
    formData.append("latitude", values.latitude);
  }
  if (values.longitude) {
    formData.append("longitude", values.longitude);
  }

  const { data } = await axiosInstance.post("/task-evidence-images", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data.data;
}

// Update TaskEvidenceImage
export async function updateTaskEvidenceImage(
  id: string,
  values: Partial<CreateTaskEvidenceImageType>,
) {
  const { data } = await axiosInstance.put(
    `/task-evidence-images/${id}`,
    values,
  );
  return data.data;
}

// Delete a TaskEvidenceImage
export async function deleteTaskEvidenceImage(id: string) {
  const { data } = await axiosInstance.delete(`/task-evidence-images/${id}`);
  return data.data;
}
