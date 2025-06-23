import { axiosInstance } from "./axiosInstance";
import { FeatureType, CreateFeatureType } from "../types/feature";

export async function getAllFeatures() {
  const { data } = await axiosInstance.get<{ data: FeatureType[] }>(
    "/features"
  );
  return data.data;
}

export async function getFeatureByEmail(email: string) {
  const { data } = await axiosInstance.get<{ data: FeatureType }>(
    "/features/email/" + email
  );
  return data.data;
}

export async function getFeatureById(id: string) {
  const { data } = await axiosInstance.get<{ data: FeatureType }>(
    "/features/" + id
  );
  return data.data;
}

export async function createFeature(values: CreateFeatureType) {
  const { data } = await axiosInstance.post("/features", values);

  return data.data;
}

export async function updateFeature(id: string, values: CreateFeatureType) {
  const { data } = await axiosInstance.put("/features/" + id, values);

  return data.data;
}

export async function deleteFeature(id: string) {
  const { data } = await axiosInstance.delete("/features/" + id);
  return data.data;
}
