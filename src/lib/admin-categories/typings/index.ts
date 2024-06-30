import { PaginationData } from "@common/typings"

export interface Category {
  id: number
  category: string
  slug: string
  created_at: string
}

export interface CategoriesData extends PaginationData {
  data: Category[]
}

export type SortFilter = "Category" | "Slug"

export interface CategoriesPaginationProps {
  data: CategoriesData
}

export interface TableRowProps extends Category {}

export interface CategoryFormProps {
  category?: Category
}
