import { axiosInstance } from "./axiosInstance";
import { DailyReportType, CreateDailyReportType } from "../types/daily-report";

export async function getAllDailyReports() {
  const { data } = await axiosInstance.get<{ data: DailyReportType[] }>(
    "/daily-reports",
  );
  return data.data;
}

export async function getDailyReportsByAccountId(accountId: string) {
  const { data } = await axiosInstance.get<{ data: DailyReportType[] }>(
    "/daily-reports/account/" + accountId,
  );
  return data.data;
}

export async function getDailyReportById(id: string) {
  const { data } = await axiosInstance.get<{ data: DailyReportType }>(
    "/daily-reports/" + id,
  );
  return data.data;
}

export async function getDailyReportEvidences(date: string) {
  const { data } = await axiosInstance.get<{ data: string }>(
    `/daily-reports/generate-report/${date}`,
  );
  return data.data;
}

export async function createDailyReport(values: CreateDailyReportType) {
  const formData = new FormData();

  formData.append("title", values.title);
  formData.append("description", values.description || "");
  formData.append("accountId", values.accountId as string);

  if (values.DailyReportEvidences && values.DailyReportEvidences.length > 0) {
    values.DailyReportEvidences.forEach((evidence: File) => {
      formData.append("DailyReportEvidences", evidence);
    });
  }

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

export async function updateDailyReport(
  id: string,
  values: CreateDailyReportType,
) {
  const formData = new FormData();

  formData.append("title", values.title);
  formData.append("description", values.description || "");
  formData.append("accountId", values.accountId as string);

  if (values.DailyReportEvidences && values.DailyReportEvidences.length > 0) {
    await Promise.all(
      values.DailyReportEvidences.map(async (evidence: any, index: number) => {
        const fileUri = evidence.image;
        const fileInfo = await FileSystem.getInfoAsync(fileUri);

        if (fileInfo.exists) {
          const fileBlob = {
            uri: fileUri,
            type: evidence.mimeType || "image/jpeg",
            name: evidence.fileName || `file_${index}.jpg`,
          };

          formData.append("DailyReportEvidences", fileBlob as any);
        } else {
          console.warn(`File not found: ${fileUri}`);
        }
      }),
    );
  }

  try {
    const { data } = await axiosInstance.post(
      "/daily-reports/" + id,
      formData,
      {
        headers: {
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

export async function deleteDailyReport(id: string) {
  const { data } = await axiosInstance.delete("/daily-reports/" + id);
  return data.data;
}
