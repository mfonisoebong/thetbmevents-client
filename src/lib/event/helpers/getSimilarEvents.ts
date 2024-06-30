import { Event } from "@lib/events/typings";
import { HttpResponse } from "@common/typings";
import { axiosInstance } from "@common/utils/axiosInstance";

export const getSimilarEvents = async (
  category: string,
  excludeId: string,
): Promise<Event[]> => {
  const { AppAxios } = axiosInstance();
  const res: HttpResponse<Event[]> = await AppAxios({
    url: `/events/category?category=${category}&exclude=${excludeId}`,
  }).then((res) => res.data);

  return res.data;
};
