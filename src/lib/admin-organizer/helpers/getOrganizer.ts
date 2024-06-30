import { HttpResponse } from "@common/typings"
import { Organizer } from "../typings"
import { axiosInstance } from "@common/utils/axiosInstance"

export const getOrganizer = async (id?: string): Promise<Organizer> => {
  const { AppAxios } = axiosInstance()
  const res: HttpResponse<Organizer> = await AppAxios({
    url: `/admin/users/organizers/${id}`,
  }).then((res) => res.data)

  return res.data
}
