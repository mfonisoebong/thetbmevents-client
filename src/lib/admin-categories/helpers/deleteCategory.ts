import { axiosInstance } from "@common/utils/axiosInstance"

export const deleteCategory = async (id: string) => {
  const { AppAxios } = axiosInstance()

  return AppAxios({
    url: `/admin/events/categories/${id}`,
    method: "DELETE",
  }).then((res) => res.data)
}
