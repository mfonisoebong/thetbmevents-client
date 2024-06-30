import { axiosInstance } from "@common/utils/axiosInstance"
import { Event } from "../typings"
import { HttpResponse } from "@common/typings"

export const getAllEvents = async (): Promise<Event[]> => {
  const { AppAxios } = axiosInstance()

  const res: HttpResponse<Event[]> = await AppAxios({
    url: "/admin/events",
  }).then((res) => res.data)

  return res.data
}
