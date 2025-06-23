import { axiosInstance } from "./axiosInstance";
import {
  CreateReportDiscussionType,
  ReportDiscussionType,
} from "../types/report-discussion";

// Fetch all ReportDiscussions
export async function getAllReportDiscussions(
  getToken: () => Promise<string | null>
) {
  const token = await getToken();
  const { data } = await axiosInstance.get<{ data: ReportDiscussionType[] }>(
    "/report-discussions",
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return data.data;
}

export async function getReportDiscussionsByReportId(
  reportId: string,
  getToken: () => Promise<string | null>
) {
  const token = await getToken();
  const { data } = await axiosInstance.get<{ data: ReportDiscussionType[] }>(
    "/report-discussions/report/" + reportId,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return data.data;
}

// Fetch a ReportDiscussion by ID
export async function getReportDiscussionById(
  id: string,
  getToken: () => Promise<string | null>
) {
  const token = await getToken();
  const { data } = await axiosInstance.get<{ data: ReportDiscussionType }>(
    `/report-discussions/${id}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return data.data;
}

// Create a ReportDiscussion
export async function createReportDiscussion(
  values: CreateReportDiscussionType,
  getToken: () => Promise<string | null>
) {
  const token = await getToken();
  const { data } = await axiosInstance.post("/report-discussions", values, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data.data;
}

// Update a ReportDiscussion
export async function updateReportDiscussion(
  id: string,
  values: CreateReportDiscussionType,
  getToken: () => Promise<string | null>
) {
  const token = await getToken();
  const { data } = await axiosInstance.put(
    `/report-discussions/${id}`,
    values,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return data.data;
}

// Delete a ReportDiscussion
export async function deleteReportDiscussion(
  id: string,
  getToken: () => Promise<string | null>
) {
  const token = await getToken();
  const { data } = await axiosInstance.delete(`/report-discussions/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data.data;
}
