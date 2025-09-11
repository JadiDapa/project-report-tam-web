import {
  CreateTaskEvidenceType,
  TaskEvidenceType,
} from "../types/task-evidence";
import { axiosInstance } from "./axiosInstance";

// Fetch all task-evidences
export async function getAllTaskEvidences(
  getToken: () => Promise<string | null>,
) {
  const token = await getToken();
  const { data } = await axiosInstance.get<{ data: TaskEvidenceType[] }>(
    "/task-evidences",
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  return data.data;
}

// Fetch a TaskEvidence by ID
export async function getTaskEvidenceById(
  id: string,
  getToken: () => Promise<string | null>,
) {
  const token = await getToken();
  const { data } = await axiosInstance.get<{ data: TaskEvidenceType }>(
    `/task-evidences/${id}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  return data.data;
}

export async function createTaskEvidence(values: CreateTaskEvidenceType) {
  const { data } = await axiosInstance.post("/task-evidences", values);
  return data.data;
}

// Update a TaskEvidence
export async function updateTaskEvidence(
  id: string,
  values: CreateTaskEvidenceType,
) {
  const formData = new FormData();

  formData.append("description", values.description || "");
  formData.append("taskId", values.taskId?.toString() ?? "");
  formData.append("accountId", values.accountId?.toString() ?? "");

  if (values.image) {
    formData.append("image", values.image as string);
  }

  try {
    const { data } = await axiosInstance.put(
      `/task-evidences/${id}`,
      formData,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return data.data;
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
}

// Delete a TaskEvidence
export async function deleteTaskEvidence(id: string) {
  const { data } = await axiosInstance.delete(`/task-evidences/${id}`);
  return data.data;
}
