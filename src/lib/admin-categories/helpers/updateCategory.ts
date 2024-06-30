import { axiosInstance } from "@common/utils/axiosInstance"
import { CategoryFormType } from "../utils/categorySchema"

export const updateCategory = async (
  data: CategoryFormType & {
    id: number
  }
) => {
  const { id, ...restData } = data
  const { AppAxios } = axiosInstance()
  return AppAxios({
    url: `/admin/events/categories/${id}`,
    method: "PATCH",
    data: restData,
  }).then((res) => res.data)
}
