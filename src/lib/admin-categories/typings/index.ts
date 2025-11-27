import { PaginationData } from "@common/typings";

export interface Category {
  id: string;
  category: string;
  slug: string;
  icon: string | null;
  created_at: string;
}

export interface CategoriesData extends PaginationData {
  data: Category[];
}

export type SortFilter = "Category" | "Slug";

export interface CategoriesPaginationProps {
  data: CategoriesData;
}

export interface TableRowProps extends Category {}

export interface CategoryFormProps {
  category?: Category;
}
