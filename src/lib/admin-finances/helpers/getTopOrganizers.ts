import { axiosInstance } from "@common/utils/axiosInstance"
import { Organizer } from "../typings"

export const getTopOrganizers = async (
  month?: string,
  year?: string | number
): Promise<Organizer[]> => {
  const { AppAxios } = axiosInstance()
  return AppAxios({
    url: `/admin/finances/top-organizers?year=${year ?? ""}&month=${
      month ?? ""
    }`,
  }).then((res) => res.data.data)
}
