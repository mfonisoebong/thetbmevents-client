import { axiosInstance } from "@common/utils/axiosInstance"
import { HttpResponse } from "@common/typings"
import { UsersData } from "@lib/admin-users/typings"

export const getOrganizers = async (
  page?: string,
  search?: string
): Promise<UsersData> => {
  const { AppAxios } = axiosInstance()
  const url = !page
    ? `/admin/users/organizers?search=${search ?? ""}`
    : `/admin/users/organizers?page=${page}&search=${search ?? ""}`

  const res: HttpResponse<UsersData> = await AppAxios({
    url,
  }).then((res) => res.data)

  return res.data
}
