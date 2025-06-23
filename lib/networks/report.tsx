import { axiosInstance } from "./axiosInstance";
import { ReportType, CreateReportType } from "../types/report";

// Fetch all reports
export async function getAllReports(getToken: () => Promise<string | null>) {
  const token = await getToken();
  const { data } = await axiosInstance.get<{ data: ReportType[] }>("/reports", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data.data;
}

// Fetch a Report by ID
export async function getReportById(
  id: string,
  getToken: () => Promise<string | null>,
) {
  const token = await getToken();
  const { data } = await axiosInstance.get<{ data: ReportType }>(
    `/reports/${id}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  return data.data;
}

import axios from "axios";

export async function createReport(
  values: CreateReportType,
  getToken: () => Promise<string | null>,
) {
  const token = await getToken();
  const formData = new FormData();

  formData.append("title", values.title);
  formData.append("description", values.description || "");
  formData.append("serialNumber", values.serialNumber || "");
  formData.append("location", values.location || "");
  formData.append("projectId", values.projectId as string);
  formData.append("accountId", values.accountId as string);

  if (values.ReportEvidences && values.ReportEvidences.length > 0) {
    values.ReportEvidences.forEach((evidence: File) => {
      formData.append("ReportEvidences", evidence);
    });
  }

  try {
    const { data } = await axios.post("/api/reports", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`, // Optional
      },
    });

    return data.data;
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
}

// Update a Report
export async function updateReport(
  id: string,
  values: CreateReportType,
  getToken: () => Promise<string | null>,
) {
  const token = await getToken();
  const { data } = await axiosInstance.put(`/reports/${id}`, values, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data.data;
}

// Delete a Report
export async function deleteReport(
  id: string,
  getToken: () => Promise<string | null>,
) {
  const token = await getToken();
  const { data } = await axiosInstance.delete(`/reports/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data.data;
}
