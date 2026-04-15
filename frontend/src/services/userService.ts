import { apiFetch, type ApiResult } from "./apiClient";


export type AdminUser = {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "USER";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  role?: "ADMIN" | "USER";
}

export interface UpdateUserDto {
  name?: string;
  role?: "ADMIN" | "USER";
  isActive?: boolean;
}


export const userService = {

  getAll(): Promise<ApiResult<AdminUser[]>> {
    return apiFetch<AdminUser[]>("/users", { tags: ["users"] });
  },

  create(data: CreateUserDto): Promise<ApiResult<AdminUser>> {
    return apiFetch<AdminUser>("/users", { method: "POST", body: data });
  },


  update(id: string, data: UpdateUserDto): Promise<ApiResult<AdminUser>> {
    return apiFetch<AdminUser>(`/users/${id}`, { method: "PATCH", body: data });
  },

  delete(id: string): Promise<ApiResult<{ message: string }>> {
    return apiFetch<{ message: string }>(`/users/${id}`, { method: "DELETE" });
  },
};
