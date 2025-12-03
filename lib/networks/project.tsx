import { axiosInstance } from "./axiosInstance";
import { CreateProjectType, ProjectType } from "../types/project";

// Fetch all projects
export async function getAllProjects() {
  const { data } = await axiosInstance.get<{ data: ProjectType[] }>(
    "/projects",
  );
  return data.data;
}

export async function getProjectsByProgramId(programId: string) {
  const { data } = await axiosInstance.get<{ data: ProjectType[] }>(
    `/projects/program/${programId}`,
  );
  return data.data;
}

// Fetch a project by ID
export async function getProjectsByAccountId(accountId: string) {
  const { data } = await axiosInstance.get<{ data: ProjectType[] }>(
    `/projects/account/${accountId}`,
  );
  return data.data;
}

// Fetch a project by ID
export async function getProjectById(id: string) {
  const { data } = await axiosInstance.get<{ data: ProjectType }>(
    `/projects/${id}`,
    {},
  );
  return data.data;
}

export async function getProjectEvidences(id: string) {
  const { data } = await axiosInstance.get<{ data: string }>(
    `/projects/generate-evidence/${id}`,
  );
  return data.data;
}

export async function notifyEmployees(
  projectId: number,
  employeeIds: number[],
) {
  const response = await axiosInstance.post(`/notifications/send`, {
    projectId,
    employeeIds,
  });

  return response.data;
}

// Create a project
export async function createProject(values: CreateProjectType) {
  const { data } = await axiosInstance.post("/projects", values);
  return data.data;
}

// Update a project
export async function updateProject(id: string, values: CreateProjectType) {
  const { data } = await axiosInstance.put(`/projects/${id}`, values, {});
  return data.data;
}

// Delete a project
export async function deleteProject(id: string) {
  const { data } = await axiosInstance.delete(`/projects/${id}`);
  return data.data;
}
