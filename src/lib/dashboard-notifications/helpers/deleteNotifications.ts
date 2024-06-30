import { axiosInstance } from "@common/utils/axiosInstance"

export const deleteNotifications = async () => {
  const { AppAxios } = axiosInstance()

  return AppAxios({
    url: "/notifications/all",
    method: "DELETE",
  }).then((res) => res.data)
}
