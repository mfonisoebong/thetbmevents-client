import { EventData } from "@lib/edit-event/typings";
import { HttpResponse } from "@common/typings";
import { axiosInstance } from "@common/utils/axiosInstance";

export const getEvent = async (slug?: string): Promise<EventData> => {
  const { AppAxios } = axiosInstance();
  const res: HttpResponse<EventData> = await AppAxios({
    url: `/events/${slug}`,
  }).then((res) => res.data);

  return res.data;
};
