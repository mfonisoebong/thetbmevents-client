import { axiosInstance } from "@common/utils/axiosInstance"
import { CategoryFormType } from "../utils/categorySchema"

export const createCategory = async (data: CategoryFormType) => {
  const { AppAxios } = axiosInstance()
  return AppAxios({
    url: "/admin/events/categories",
    method: "POST",
    data,
  }).then((res) => res.data)
}
