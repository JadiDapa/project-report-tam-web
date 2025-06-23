import { axiosInstance } from "./axiosInstance";
import { DailyReportType, CreateDailyReportType } from "../types/daily-report";

// Get all daily reports
export async function getAllDailyReports() {
  const { data } = await axiosInstance.get<{ data: DailyReportType[] }>(
    "/daily-reports",
  );
  return data.data;
}

// Get daily reports by accountId
export async function getDailyReportsByAccountId(accountId: string) {
  const { data } = await axiosInstance.get<{ data: DailyReportType[] }>(
    `/daily-reports/account/${accountId}`,
  );
  return data.data;
}

// Get single daily report
export async function getDailyReportById(id: string) {
  const { data } = await axiosInstance.get<{ data: DailyReportType }>(
    `/daily-reports/${id}`,
  );
  return data.data;
}

// Get report evidence
export async function getDailyReportEvidences(date: string) {
  const { data } = await axiosInstance.get<{ data: string }>(
    `/daily-reports/generate-report/${date}`,
  );
  return data.data;
}

// Create a daily report
export async function createDailyReport(values: CreateDailyReportType) {
  const formData = new FormData();
  formData.append("title", values.title);
  formData.append("description", values.description || "");
  formData.append("accountId", String(values.accountId));

  (values.DailyReportEvidences as unknown as File[]).forEach((file) => {
    formData.append("DailyReportEvidences", file);
  });

  try {
    const { data } = await axiosInstance.post("/daily-reports", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data.data;
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
}

// Update a daily report
export async function updateDailyReport(
  id: string,
  values: CreateDailyReportType,
) {
  const formData = new FormData();
  formData.append("title", values.title);
  formData.append("description", values.description || "");
  formData.append("accountId", String(values.accountId));

  (values.DailyReportEvidences as unknown as File[]).forEach((file) => {
    formData.append("DailyReportEvidences", file);
  });

  try {
    const { data } = await axiosInstance.post(
      `/daily-reports/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return data.data;
  } catch (error) {
    console.error("Update error:", error);
    throw error;
  }
}

// Delete a daily report
export async function deleteDailyReport(id: string) {
  const { data } = await axiosInstance.delete(`/daily-reports/${id}`);
  return data.data;
}
