import { CreateProgramType, ProgramType } from "../types/program";
import { axiosInstance } from "./axiosInstance";

// Fetch all programs
export async function getAllPrograms() {
  const { data } = await axiosInstance.get<{ data: ProgramType[] }>(
    "/programs",
  );
  return data.data;
}

// Fetch a program by ID
export async function getProgramsByAccountId(accountId: string) {
  const { data } = await axiosInstance.get<{ data: ProgramType[] }>(
    `/programs/account/${accountId}`,
  );
  return data.data;
}

// Fetch a program by ID
export async function getProgramById(id: string) {
  const { data } = await axiosInstance.get<{ data: ProgramType }>(
    `/programs/${id}`,
    {},
  );
  return data.data;
}

export async function getProgramReportEvidences(
  id: string,
  getToken: () => Promise<string | null>,
) {
  const token = await getToken();
  const { data } = await axiosInstance.get<{ data: string }>(
    `/programs/generate-report/${id}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  return data.data;
}

export async function notifyEmployees(
  programId: number,
  employeeIds: number[],
) {
  const response = await axiosInstance.post(`/notifications/send`, {
    programId,
    employeeIds,
  });

  return response.data;
}

// Create a program
export async function createProgram(values: CreateProgramType) {
  const { data } = await axiosInstance.post("/programs", values);
  return data.data;
}

// Update a program
export async function updateProgram(id: string, values: CreateProgramType) {
  const { data } = await axiosInstance.put(`/programs/${id}`, values, {});
  return data.data;
}

// Delete a program
export async function deleteProgram(id: string) {
  const { data } = await axiosInstance.delete(`/programs/${id}`);
  return data.data;
}
