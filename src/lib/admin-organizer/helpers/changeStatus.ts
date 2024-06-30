import { axiosInstance } from "@common/utils/axiosInstance"

export type NewStatus = "active" | "blocked"
export type Data = { status: NewStatus; id: string }
export const changeStatus = async (data: Data) => {
  const url =
    data.status === "active"
      ? `/admin/users/organizers/activate/${data.id}`
      : `/admin/users/organizers/deactivate/${data.id}`
  const { AppAxios } = axiosInstance()

  return AppAxios({
    url,
    method: "PATCH",
  }).then((res) => res.data)
}
