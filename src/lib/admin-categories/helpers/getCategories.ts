import { HttpResponse } from "@common/typings"
import { CategoriesData } from "../typings"
import { axiosInstance } from "@common/utils/axiosInstance"

export const getCategories = async (
  page?: string,
  search?: string
): Promise<CategoriesData> => {
  const { AppAxios } = axiosInstance()

  const url = !page
    ? `/admin/events/categories?search=${search ?? ""}`
    : `/admin/events/categories?page=${page}&search=${search ?? ""}`

  const res: HttpResponse<CategoriesData> = await AppAxios({
    url,
  }).then((res) => res.data)

  return res.data
}
