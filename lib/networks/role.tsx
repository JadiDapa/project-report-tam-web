import { axiosInstance } from "./axiosInstance";
import { RoleType, CreateRoleType } from "../types/role";

export async function getAllRoles() {
  const { data } = await axiosInstance.get<{ data: RoleType[] }>("/roles");
  return data.data;
}

export async function getRoleByEmail(email: string) {
  const { data } = await axiosInstance.get<{ data: RoleType }>(
    "/roles/email/" + email,
  );
  return data.data;
}

export async function getRoleById(id: string) {
  const { data } = await axiosInstance.get<{ data: RoleType }>("/roles/" + id);
  return data.data;
}

export async function createRole(values: CreateRoleType) {
  const { data } = await axiosInstance.post("/roles", values);
  return data.data;
}

export async function updateRole(id: string, values: CreateRoleType) {
  const { data } = await axiosInstance.put("/roles/" + id, values, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data.data;
}

export async function deleteRole(id: string) {
  const { data } = await axiosInstance.delete("/roles/" + id);
  return data.data;
}
