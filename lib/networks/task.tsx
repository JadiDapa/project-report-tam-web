import { axiosInstance } from "./axiosInstance";
import { TaskType, CreateTaskType } from "../types/task";
import { CreateTaskEvidenceType } from "../types/task-evidence";

// Fetch all tasks
export async function getAllTasks() {
  const { data } = await axiosInstance.get<{ data: TaskType[] }>("/tasks", {});
  return data.data;
}

// Fetch a Task by ID
export async function getTaskById(id: string) {
  const { data } = await axiosInstance.get<{ data: TaskType }>(`/tasks/${id}`);
  return data.data;
}

export async function getTaskReportEvidences(id: string) {
  const { data } = await axiosInstance.get<{ data: string }>(
    `/tasks/generate-evidence/${id}`,
  );
  return data.data;
}

export async function createTask(values: CreateTaskType) {
  const { data } = await axiosInstance.post("/tasks", values);
  return data.data;
}

export async function createTasks(values: CreateTaskType[]) {
  const { data } = await axiosInstance.post("/tasks/generate", values);
  return data.data;
}

export async function createTaskEvidence(
  id: string,
  values: CreateTaskEvidenceType,
) {
  const formData = new FormData();

  formData.append("description", values.description || "");
  formData.append("taskId", values.taskId?.toString() ?? "");
  formData.append("accountId", values.accountId?.toString() ?? "");
  formData.append("image", values.image as string);

  try {
    const { data } = await axiosInstance.post("/tasks/" + id, formData, {
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

// Update a Task
export async function updateTask(id: string, values: CreateTaskType) {
  const { data } = await axiosInstance.put(`/tasks/${id}`, values, {});
  return data.data;
}

// Delete a Task
export async function deleteTask(id: string) {
  const { data } = await axiosInstance.delete(`/tasks/${id}`, {});
  return data.data;
}
