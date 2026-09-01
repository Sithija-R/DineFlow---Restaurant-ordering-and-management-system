export type AvailabilityStatus = "AVAILABLE" | "OUT_OF_STOCK";

export interface Category {
  id: number;
  name: string;
}

export interface CategoryRequest {
  name: string;
}

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  status: AvailabilityStatus;
  availableCount: number;
  imageUrl?: string;
  categoryId: number;
  categoryName?: string;
}

export interface MenuItemRequest {
  name: string;
  description: string;
  price: number;
  categoryId: number;
  availableCount: number;
  imageUrl?: string;
}

