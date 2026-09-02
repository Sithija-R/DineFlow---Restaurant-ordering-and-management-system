import { menuClient } from "./api";
import type {
  Category,
  CategoryRequest,
  MenuItem,
  MenuItemRequest,
} from "../types/menu";

export const getCategories = async (): Promise<Category[]> => {
  const response = await menuClient.get<Category[]>(
    "/api/categories"
  );
    console.log("Fetched categories:", response.data);
  return response.data;
};

export const getMenuItems = async (): Promise<MenuItem[]> => {
  const response = await menuClient.get<MenuItem[]>(
    "/api/menu-items"
  );

  return response.data;
};

export const getMenuItem = async (
  id: number
): Promise<MenuItem> => {
  const response = await menuClient.get<MenuItem>(
    `/api/menu-items/${id}`
  );

  return response.data;
};

export const createMenuItem = async (
  request: MenuItemRequest
): Promise<MenuItem> => {
  const response = await menuClient.post<MenuItem>(
    "/api/menu-items",
    request
  );

  return response.data;
};

export const updateMenuItem = async (
  id: number,
  request: MenuItemRequest
): Promise<MenuItem> => {
  const response = await menuClient.put<MenuItem>(
    `/api/menu-items/${id}`,
    request
  );

  return response.data;
};

export const deleteMenuItem = async (
  id: number
): Promise<void> => {
  await menuClient.delete(`/api/menu-items/${id}`);
};

export const createCategory = async (
  request: CategoryRequest
): Promise<Category> => {
  const response = await menuClient.post<Category>(
    "/api/categories",
    request
  );

  return response.data;
};

export const updateCategory = async (
  id: number,
  request: CategoryRequest
): Promise<Category> => {
  const response = await menuClient.put<Category>(
    `/api/categories/${id}`,
    request
  );

  return response.data;
};

export const deleteCategory = async (
  id: number
): Promise<void> => {
  await menuClient.delete(`/api/categories/${id}`);
};