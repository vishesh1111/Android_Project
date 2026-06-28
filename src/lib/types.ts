export type MainCategory = "commercial" | "domestic";

export interface SubCategory {
  id: string;
  label: string;
  subtitle: string;
  iconName: string;
}

export interface CategoryData {
  label: string;
  subtitle: string;
  description: string;
  subcategories: SubCategory[];
}

export interface Product {
  id: string;
  name: string;
  type: string;
  shortDescription: string;
  fullDescription: string;
  features: string[];
  price?: number;
  mainCategory: MainCategory;
  subCategory: string; // e.g., 'treadmills', 'bikes'
  series?: string; // e.g., 'Signature Series (PC)' for commercial strength
  images: any[];
  specifications: Record<string, string>;
  inStock: boolean;
  createdAt: Date;
}
